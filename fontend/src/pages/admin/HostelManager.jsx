import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rooms, hiddenHouse, visibleHouse } from '../../api/api.jsx';
import Pagination from '../../components/Pagination.jsx';
import AddHostelModal from "../../components/admin/AddHostelModal.jsx";

// --- LOGIC ÁNH XẠ DỮ LIỆU (KHÔNG ĐỔI) ---
const mapApiDataToHostelStructure = (apiData) => {
    return apiData.map(item => ({
        id: item.house_Id,
        name: item.house_Name || `Nhà trọ ID: ${item.house_Id}`,
        userid: item.user_Id,
        userName: item.userName || 'Chủ trọ ẩn danh',
        houseStatus: item.status, // Giả định 1=Active, 2=Hidden
        address: `${item.street}, ${item.commune}, ${item.province}`,
        rooms: item.rooms || [],
        originalData: item
    }));
};
const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
// ----------------------------------------

// Component Modal hiển thị chi tiết phòng (Không đổi)
const RoomDetailModal = ({ roomList, hostelName, show, onClose, hostelId, onClick }) => {
    if (!show) return null;

    return (
        // Modal Backdrop
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Danh sách phòng - {hostelName}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {roomList.length === 0 ? (
                            <p className="text-muted text-center">Nhà trọ này chưa có phòng nào được đăng ký.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered table-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Tên phòng</th>
                                            <th>Giá</th>
                                            <th>Trạng thái</th>
                                            <th>Tiện ích chính</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomList.map((room) => (
                                            <tr key={room.room_Id}>
                                                <td>{room.room_Id}</td>
                                                <td>{room.title || `Phòng ${room.room_Id}`}</td>
                                                <td>{room.price ? `${room.price.toLocaleString('vi-VN')} ₫` : 'N/A'}</td>
                                                <td>
                                                    <span className={`badge bg-${room.status === 1 ? 'success' : 'danger'}`}>
                                                        {room.status === 1 ? 'Còn trống' : 'Đã thuê'}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary ms-1" // Thêm ms-1 để có khoảng cách
                                                        title="Xem chi tiết"
                                                        onClick={() => onClick(hostelId, room.room_Id)}
                                                    >
                                                        <i className="bi bi-info-circle-fill"></i>
                                                    </button>
                                                </td>
                                                <td>
                                                    {room.roomProperty?.has_AirConditioner && 'Đ.Hoà, '}
                                                    {room.roomProperty?.has_Wifi && 'Wifi, '}
                                                    {room.roomProperty?.has_Mezzanine && 'Gác'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function HostelManagerAPI() {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [newHostel, setNewHostel] = useState({ name: "", address: "" });
    const [showAddModal, setShowAddModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHostel, setSelectedHostel] = useState({ name: '', rooms: [] });
    const navigate = useNavigate();

    // Hook để fetch dữ liệu từ API (Không đổi)
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const apiData = await rooms();
                const mappedData = mapApiDataToHostelStructure(apiData);
                setHostels(mappedData);
                setCurrentPage(1);
            } catch (error) {
                console.error("Failed to load hostel data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);


    // --- HÀM XỬ LÝ SỰ KIỆN (Không đổi) ---

    const handleShowRooms = (hostel) => {
        setSelectedHostel(hostel);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedHostel({ name: '', rooms: [] });
    };

    const handleHideHouse = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn ẨN nhà trọ này khỏi danh sách công khai?")) {
            await hiddenHouse(id);
            // window.location.reload(true);
        }
    };

    const handleVisibleHouse = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn HIỆN nhà trọ này trở lại danh sách công khai?")) {
            await visibleHouse(id);
            window.location.reload(true);
        }
    };
    const handleViewDetail = (id) => {
        navigate(`/houses/${id}`);
    };

    const handleViewDetailRoom = (houseId, roomId) => {
        setIsModalOpen(false); // Đóng modal trước khi chuyển trang
        navigate(`/houses/${houseId}/rooms/${roomId}`);
    }

    const handleViewReport = (id) => {
        alert(`Xem báo cáo/thống kê của Nhà trọ ID ${id}.`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa nhà trọ này?")) {
            setHostels(prevHostels => prevHostels.filter(h => h.id !== id));
            setCurrentPage(1);
        }
    };

    const handleSave = (id, name, address) => {
        setHostels(prevHostels => prevHostels.map(h => h.id === id ? { ...h, name, address } : h));
        setEditingId(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    // ----------------------------------------

    // --- LOGIC PHÂN TRANG & TÌM KIẾM ---
    const filteredHostels = hostels.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.address.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredHostels.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentHostels = filteredHostels.slice(startIndex, endIndex);


    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Đang tải dữ liệu nhà trọ...</p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Header và Form thêm mới (Không đổi) */}
            <div className="row justify-content-center mb-4">
                <div className="col-12 col-lg-10">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 py-3 px-2 px-md-4 bg-white rounded-4 shadow-sm mb-3">
                        <div>
                            <h2 className="fw-bold text-primary d-flex align-items-center mb-1">
                                <i className="bi bi-house-door me-2 fs-2"></i>
                                Quản lý nhà trọ
                            </h2>
                            <p className="text-muted fs-5 mb-0">Tổng số: {hostels.length} nhà trọ</p>
                        </div>
                        <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                            <i className="bi bi-plus-circle"></i> Thêm nhà trọ
                        </button>
                        <AddHostelModal
                            show={showAddModal && !isModalOpen}
                            onClose={() => setShowAddModal(false)}
                            onAdded={() => window.location.reload()}
                        />
                    </div>
                </div>
            </div >

            {/* Thanh tìm kiếm và Bảng dữ liệu */}
            < div className="row justify-content-center mb-3" >
                <div className="col-12 col-lg-10">
                    <input
                        type="search"
                        className="form-control mb-2"
                        placeholder="Tìm kiếm nhà trọ theo tên hoặc địa chỉ..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <div className="table-responsive">
                        <table className="table table-hover align-middle bg-white rounded shadow-sm">
                            <thead className="table-primary">
                                <tr>
                                    {/* Sửa lỗi bằng cách đặt tất cả <th> liền nhau trên một dòng */}
                                    <th style={{ width: 60 }}>#</th><th>Tên nhà trọ</th><th>Chủ trọ / Trạng thái</th><th>Địa chỉ</th><th>
                                        Số phòng
                                        <i className="bi bi-question-circle ms-2" title="Nhấn để xem danh sách phòng"></i>
                                    </th><th style={{ width: 150 }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentHostels.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">
                                            Không tìm thấy nhà trọ nào.
                                        </td>
                                    </tr>
                                ) : (
                                    currentHostels.map((hostel, idx) => {
                                        const statusBadge = hostel.houseStatus === 1
                                            ? <span className="badge bg-success">Đang hoạt động</span>
                                            : <span className="badge bg-secondary">Đã ẩn</span>;
                                        const hideButtonText = hostel.houseStatus === 1 ? 'Ẩn' : 'Hiện';
                                        const hideButtonColor = hostel.houseStatus === 1 ? 'warning' : 'success';

                                        return (
                                            <tr key={hostel.id}>
                                                <td>{startIndex + idx + 1}</td>
                                                <td>
                                                    {editingId === hostel.id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            defaultValue={hostel.name}
                                                            onBlur={e => handleSave(hostel.id, e.target.value, hostel.address)}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        hostel.name
                                                    )}
                                                </td>
                                                {/* Cột Chủ trọ / Trạng thái */}
                                                <td>
                                                    <div className="fw-semibold">{hostel.userName}</div>
                                                    <div className="mt-1">{statusBadge}</div>
                                                </td>
                                                {/* Cột Địa chỉ */}
                                                <td>
                                                    {editingId === hostel.id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            defaultValue={hostel.address}
                                                            onBlur={e => handleSave(hostel.id, hostel.name, e.target.value)}
                                                        />
                                                    ) : (
                                                        hostel.address
                                                    )}
                                                </td>
                                                {/* Cột Số phòng */}
                                                <td>
                                                    <button
                                                        className="badge bg-info text-dark border-0 p-2"
                                                        onClick={() => handleShowRooms(hostel)}
                                                        style={{ cursor: 'pointer' }}
                                                        title="Xem chi tiết các phòng"
                                                    >
                                                        {hostel.rooms.length}
                                                        <i className="bi bi-question-circle ms-1"></i>
                                                    </button>
                                                </td>
                                                {/* Cột Thao tác */}
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <button
                                                            className={`btn btn-sm btn-${hideButtonColor}`}
                                                            title={`${hideButtonText} nhà trọ`}
                                                            onClick={() => (hostel.houseStatus === 1 ? handleHideHouse(hostel.id) : handleVisibleHouse(hostel.id))}
                                                        >
                                                            <i className={`bi bi-eye-${hostel.houseStatus === 1 ? 'slash-fill' : 'fill'}`}></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            title="Xem chi tiết (Edit)"
                                                            onClick={() => handleViewDetail(hostel.id)}
                                                        >
                                                            <i className="bi bi-info-circle-fill"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            title="Xem báo cáo"
                                                            onClick={() => handleViewReport(hostel.id)}
                                                        >
                                                            <i className="bi bi-bar-chart-fill"></i>
                                                        </button>
                                                        {hostel.userid == JSON.parse(localStorage.getItem('user')).id && (
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                title="Xóa nhà trọ"
                                                                onClick={() => handleDelete(hostel.id)}
                                                            >
                                                                <i className="bi bi-trash-fill"></i>
                                                            </button>
                                                        )}

                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >

            {/* PHÂN TRANG */}
            < div className="row justify-content-center" >
                <div className="col-12 col-lg-10">
                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        maxButtons={5}
                    />
                </div>
            </div >

            {/* MODAL & BACKDROP */}
            < RoomDetailModal
                roomList={selectedHostel.rooms}
                hostelName={selectedHostel.name}
                hostelId={selectedHostel.id}
                show={isModalOpen}
                onClick={handleViewDetailRoom}
                onClose={handleCloseModal}
            />
            {
                isModalOpen && <div className="modal-backdrop fade show"></div>
            }

            {/* Custom CSS */}
            <style>{`
                /* ... (CSS không đổi) */
                .table {
                    border-radius: 1rem;
                    overflow: hidden;
                }
                .table thead th {
                    vertical-align: middle;
                }
                .table td, .table th {
                    background: #fff;
                }
                .table-responsive {
                    border-radius: 1rem;
                }
                /* Thêm icon Bootstrap */
                @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
            `}</style>
        </div >
    );
}