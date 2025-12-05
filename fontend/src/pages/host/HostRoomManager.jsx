import { useState, useEffect } from 'react';
import { house, checkBooking, api, fetchRoomsByHouseId } from '../../api/api';
import AddHouseModal from '../../components/host/AddHostelModal.jsx';
import EditHouseModal from '../../components/host/EditHostelModal.jsx';
import EditRoomModal from '../../components/host/EditRoomModal.jsx';
import DeleteRoomModal from '../../components/host/DeleteRoomModal.jsx';
import DeleteHouseModal from '../../components/host/DeleteHouseModal.jsx';
import AddRoomModal from '../../components/host/AddRoomModal.jsx';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

// 1. Định nghĩa Constant để tránh sai sót
const DB_STATUS = {
    VISIBLE: 'visible',
    HIDDEN: 'hidden'  // (Lưu ý: Kiểm tra xem DB bạn là 'hidden' hay 'hiden' để sửa cho khớp)
};

const UI_STATUS = {
    AVAILABLE: 'available',     // Còn trống
    OCCUPIED: 'occupied',       // Đã thuê
    MAINTENANCE: 'maintenance'  // Bảo trì
};

export default function HostRoomManager() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedHouse, setSelectedHouse] = useState('');
    const [houses, setHouses] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'))?.id;
    const [bookingStatuses, setBookingStatuses] = useState({});

    // Modal states...
    const [showAddHouseModal, setShowAddHouseModal] = useState(false);
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);

    const [editingHouse, setEditingHouse] = useState(null);
    const [showEditHouseModal, setShowEditHouseModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const [showEditRoomModal, setShowEditRoomModal] = useState(false);

    const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
    const [showDeleteHouseModal, setShowDeleteHouseModal] = useState(false);
    const [deletingHouse, setDeletingHouse] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        fetchHostHouses();
    }, []);

    useEffect(() => {
        if (selectedHouse) {
            fetchRoomsByHouse(selectedHouse);
        }
    }, [selectedHouse]);

    // 2. SỬA LỖI HIỆU NĂNG: Dùng Promise.all thay vì forEach
    useEffect(() => {
        const fetchBookingStatuses = async () => {
            if (rooms.length === 0) return;

            const statuses = {};
            // Chạy song song tất cả các request kiểm tra booking
            await Promise.all(rooms.map(async (room) => {
                try {
                    const isBooked = await checkBooking(room.room_Id);
                    statuses[room.room_Id] = isBooked;
                } catch (error) {
                    console.error(`Lỗi check booking phòng ${room.room_Id}`, error);
                    statuses[room.room_Id] = false; // Mặc định là false nếu lỗi
                }
            }));
            setBookingStatuses(statuses);
        };

        fetchBookingStatuses();
    }, [rooms]);

    const fetchHostHouses = async () => {
        try {
            const response = await house();
            const hostHouses = response.filter(h => h.user_Id === user);
            console.log(hostHouses);
            setHouses(hostHouses);
            if (hostHouses.length > 0) {
                setSelectedHouse(hostHouses[0].house_Id);
            }
        } catch (error) {
            console.error('Error fetching houses:', error);
        }
    };

    const fetchRoomsByHouse = async (houseId) => {
        try {
            setLoading(true);
            const response = await fetchRoomsByHouseId(houseId);
            setRooms(response);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    // 3. HÀM CHUYỂN ĐỔI (QUAN TRỌNG): UI -> DB
    const mapUiToDbStatus = (uiValue) => {
        if (uiValue === UI_STATUS.MAINTENANCE) return DB_STATUS.HIDDEN;
        return DB_STATUS.VISIBLE; // Cả 'available' và 'occupied' đều là visible trong DB
    };

    const handleStatusChange = async (roomId, dbStatus) => {
        try {
            console.log('Updating room status:', roomId, dbStatus);
            // dbStatus lúc này phải là 'visible' hoặc 'hidden'
            await api.patch(`/Rooms/${roomId}/status`, dbStatus);
            fetchRoomsByHouse(selectedHouse);
        } catch (error) {
            console.error('Error updating room status:', error);
            alert("Cập nhật thất bại. Vui lòng thử lại!");
        }
    };

    const openDeleteHouseModal = (houseToDelete) => {
        setDeletingHouse(houseToDelete);
        setShowDeleteHouseModal(true);
    };

    // 4. LOGIC HIỂN THỊ TRẠNG THÁI
    const getRoomStatus = (room) => {
        // Nếu DB là hidden -> UI là Bảo trì
        if (room.status === DB_STATUS.HIDDEN) {
            return UI_STATUS.MAINTENANCE;
        }
        // Nếu DB là visible -> Check xem có khách thuê không
        else if (room.status === DB_STATUS.VISIBLE) {
            return bookingStatuses[room.room_Id] ? UI_STATUS.OCCUPIED : UI_STATUS.AVAILABLE;
        }
        return UI_STATUS.AVAILABLE;
    }

    const filteredRooms = rooms.filter(room => {
        const matchSearch = room.title?.toLowerCase().includes(search.toLowerCase()) ||
            room.description?.toLowerCase().includes(search.toLowerCase());
        const roomStatus = getRoomStatus(room);
        const matchStatus = !filterStatus || roomStatus === filterStatus;
        return matchSearch && matchStatus;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            default: return 0;
        }
    });

    // Logic quyền sửa/xóa (Giữ nguyên)
    const canEditHouse = (house) => {
        const rooms = house.rooms || [];
        return rooms.every(room => !bookingStatuses[room.room_Id]);
    };

    const canDeleteHouse = (house) => {
        const rooms = house.rooms || [];
        let isDelete = rooms.length === 0 || rooms.every(room => !bookingStatuses[room.room_Id]);
        if (!isDelete) { /* Alert logic here */ }
        return isDelete;
    };
    const canEditRoom = (room) => !bookingStatuses[room.room_Id];
    const canDeleteRoom = (room) => !bookingStatuses[room.room_Id];

    // Modals handling...
    const openEditHouseModal = (room) => { setEditingHouse(room); setShowEditHouseModal(true); };
    const openEditRoomModal = (room) => { setEditingRoom(room); setShowEditRoomModal(true); };
    const openDeleteRoomModal = (room) => { setEditingRoom(room); setShowDeleteRoomModal(true); };

    const convertImagesToDisplay = (room) => {
        return import.meta.env.VITE_URL_ROOT + room.image_Url;
    }
    console.log()
    return (
        <div className="container py-4">
            {/* Header & Sidebar giữ nguyên... */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Quản lý phòng trọ</h1>
                <button className="btn btn-primary" onClick={() => setShowAddHouseModal(true)}>
                    <i className="bi bi-plus-lg me-2"></i> Thêm nhà trọ mới
                </button>
            </div>
            <AddHouseModal show={showAddHouseModal} houseId={selectedHouse} onClose={() => setShowAddHouseModal(false)} onAdded={() => fetchRoomsByHouse(selectedHouse)} />

            <div className="row g-2">
                {/* Sidebar List Houses (Copy code cũ vào đây) */}
                <div className="col-12 col-lg-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-gradient bg-primary text-white border-0 p-3">
                            <h5 className="mb-0"><i className="bi bi-building me-2"></i>Nhà trọ</h5>
                        </div>
                        <div className="card-body p-2">
                            {houses.map(house => (
                                <div key={house.house_Id}
                                    className={`p-3 rounded-2 transition-all ${selectedHouse === house.house_Id ? 'bg-primary bg-opacity-10 border border-primary' : 'bg-light border border-light'}`}
                                    onClick={() => setSelectedHouse(house.house_Id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '36px', height: '36px', backgroundColor: selectedHouse === house.house_Id ? '#3b82f6' : '#e5e7eb' }}>
                                            <i className={`bi ${selectedHouse === house.house_Id ? 'bi-house-fill' : 'bi-house'} ${selectedHouse === house.house_Id ? 'text-white' : 'text-secondary'}`}></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-600">{house.house_Name}</h6>
                                            <small className="text-muted">{house.rooms?.length || 0} phòng</small>
                                            <span className={`ms-2 badge bg-${house.status === 'visible' ? 'success' : 'secondary'}`}>
                                                {house.status}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Buttons Edit/Delete House */}
                                    {selectedHouse === house.house_Id && (
                                        <div className="d-flex gap-2 pt-2 border-top">
                                            <button className="btn btn-xs btn-outline-primary flex-grow-1" disabled={!canEditHouse(house)} onClick={() => openEditHouseModal(house)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-xs btn-outline-danger flex-grow-1" disabled={!canDeleteHouse(house)} onClick={() => openDeleteHouseModal(house)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="col-12 col-lg-9">
                    {/* Filter Section */}
                    <div className="card shadow-sm mb-4 border-0">
                        <div className="card-body p-3">
                            <div className="mb-3">
                                <input type="search" className="form-control border-0 bg-light" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                            <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center">
                                <div className="d-flex gap-2 w-100 w-md-auto flex-grow-1">
                                    <select className="form-select form-select-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                        <option value="">Tất cả trạng thái</option>
                                        <option value={UI_STATUS.AVAILABLE}>✓ Còn trống</option>
                                        <option value={UI_STATUS.OCCUPIED}>✗ Đã thuê</option>
                                        <option value={UI_STATUS.MAINTENANCE}>⚙ Đang sửa chữa</option>
                                    </select>
                                </div>
                                <div className="w-100 w-md-auto text-end mt-2 mt-md-0">
                                    {/* 3. NÚT KÍCH HOẠT MODAL THÊM PHÒNG */}
                                    <Button
                                        variant="success"
                                        className="w-100 fw-bold"
                                        onClick={() => setShowAddRoomModal(true)}
                                        disabled={!selectedHouse} // Chỉ enable khi đã chọn nhà
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Thêm Phòng
                                    </Button>
                                </div>
                                {/* Sort Options... */}
                            </div>

                        </div>
                    </div>

                    {/* Room Grid */}
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2">
                        {filteredRooms.map(room => (
                            <div key={room.room_Id} className="col text-decoration-none text-dark">
                                <div className="card h-100 shadow-sm">
                                    <div className="position-relative" style={{ height: '180px', overflow: 'hidden' }}>
                                        <img src={room.roomImages?.[0] ? convertImagesToDisplay(room.roomImages[0]) : (room.image_Url || 'https://placehold.co/600x400')} className="card-img-top" style={{ height: '100%', objectFit: 'cover' }} />

                                        {/* 5. SỬA LỖI LOGIC CHANGE STATUS */}
                                        <div className="position-absolute top-0 end-0 p-2">
                                            <select
                                                className="form-select form-select-sm"
                                                value={getRoomStatus(room)} // Hiển thị theo UI (available/occupied/maintenance)
                                                onChange={async (e) => {
                                                    const uiValue = e.target.value;

                                                    // Nếu phòng đang có khách, không cho phép chọn lại chính nó (tránh lỗi logic)
                                                    if (bookingStatuses[room.room_Id] && uiValue === UI_STATUS.OCCUPIED) return;

                                                    // CHUYỂN ĐỔI UI -> DB TRƯỚC KHI GỬI
                                                    const dbStatus = mapUiToDbStatus(uiValue);

                                                    await handleStatusChange(room.room_Id, dbStatus);
                                                }}
                                                style={{ maxWidth: '120px' }}
                                                disabled={bookingStatuses[room.room_Id]}
                                            >
                                                <option value={UI_STATUS.AVAILABLE}>Còn trống</option>
                                                {/* Nếu đã thuê thì disable tùy chọn này để tránh người dùng chọn nhầm, 
                                                    nhưng nếu đang là 'occupied' thì nó vẫn hiện ra nhờ value={getRoomStatus} */}
                                                <option value={UI_STATUS.OCCUPIED} disabled={!bookingStatuses[room.room_Id]}>
                                                    Đã thuê
                                                </option>
                                                <option value={UI_STATUS.MAINTENANCE}>Sửa chữa</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <h6 className="card-title mb-2">{room.title}</h6>
                                        <p className="text-primary fw-bold mb-2">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
                                        </p>
                                        { }
                                        <p className="card-text text-truncate mb-3"></p>
                                        {/* Buttons Edit/Delete Room */}
                                        <div className="d-grid gap-2">
                                            <button className="btn btn-sm btn-primary" disabled={!canEditRoom(room)} onClick={() => openEditRoomModal(room)}>
                                                <i className="bi bi-pencil me-1"></i> Sửa
                                            </button>
                                            <button className="btn btn-sm btn-danger" disabled={!canDeleteRoom(room)} onClick={() => openDeleteRoomModal(room)}>
                                                <i className="bi bi-trash me-1"></i> Xóa
                                            </button>
                                            <Link to={`/houses/${selectedHouse}/rooms/${room.room_Id}`} className="btn btn-sm btn-outline-secondary">
                                                <i className="bi bi-eye me-1"></i> Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals... (Giữ nguyên) */}
            {showAddRoomModal && (
                <AddRoomModal
                    show={showAddRoomModal}
                    onClose={() => setShowAddRoomModal(false)}
                    onAdd={() => fetchRoomsByHouse(selectedHouse)}
                    houseId={selectedHouse}
                    ownerId={user}
                />
            )}
            {showEditHouseModal && <EditHouseModal show={showEditHouseModal} house={editingHouse} onClose={() => setShowEditHouseModal(false)} onUpdated={() => fetchRoomsByHouse(selectedHouse)} />}
            {showEditRoomModal && <EditRoomModal show={showEditRoomModal} room={editingRoom} houseId={selectedHouse} onClose={() => setShowEditRoomModal(false)} onUpdated={() => fetchRoomsByHouse(selectedHouse)} />}
            {showDeleteRoomModal && <DeleteRoomModal show={showDeleteRoomModal} room={editingRoom} onClose={() => setShowDeleteRoomModal(false)} onDeleted={() => { fetchRoomsByHouse(selectedHouse); setShowDeleteRoomModal(false); }} />}
            {showDeleteHouseModal && <DeleteHouseModal show={showDeleteHouseModal} house={deletingHouse} onClose={() => setShowDeleteHouseModal(false)} onDeleted={() => { fetchHostHouses(); setShowDeleteHouseModal(false); }} />}
        </div>
    );
}