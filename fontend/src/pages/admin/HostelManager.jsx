import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { house, hiddenHouse, visibleHouse, createHouse, updateHouse, deleteHouse, api } from "../../api/api.jsx";
import { deleteRoom } from "../../api/room.jsx";
import Pagination from "../../components/Pagination.jsx";
import AddHostelModal from "../../components/host/AddHostelModal.jsx";
import EditHostelModal from "../../components/host/EditHostelModal.jsx";
import DeleteHouseModal from "../../components/host/DeleteHouseModal.jsx";
import AddRoomModal from "../../components/host/AddRoomModal.jsx";
import EditRoomModal from "../../components/host/EditRoomModal.jsx";
import DeleteRoomModal from "../../components/host/DeleteRoomModal.jsx";

const mapApiDataToHostelStructure = (data) => {
    const list = Array.isArray(data) ? data : [data];

    return list.map((item) => ({
        id: item.house_Id,
        name: item.house_Name || `Nhà trọ ${item.house_Id}`,
        userName: item.userName || "Chủ trọ ẩn danh",
        status: item.status,
        address: item.street + ", " + item.commune + ", " + item.province,
        rooms: item.rooms || [],
        user_Id: item.user_Id,
        ...item
    }));
};

export default function HostelManagerV2() {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const [showAddHouseModal, setShowAddHouseModal] = useState(false);
    const [showEditHouseModal, setShowEditHouseModal] = useState(false);
    const [showDeleteHouseModal, setShowDeleteHouseModal] = useState(false);
    const [editingHouse, setEditingHouse] = useState(null);
    const [deletingHouse, setDeletingHouse] = useState(null);

    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [showEditRoomModal, setShowEditRoomModal] = useState(false);
    const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [deletingRoom, setDeletingRoom] = useState(null);


    const loadData = async () => {
        setLoading(true);
        try {
            const apiData = await house();
            setHostels(mapApiDataToHostelStructure(apiData));
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        const isVisible = currentStatus === "visible";
        const actionText = isVisible ? "Ẩn" : "Hiện";

        if (window.confirm(`Bạn có chắc muốn ${actionText} nhà trọ này?`)) {
            try {
                if (isVisible) {
                    await hiddenHouse(id);
                } else {
                    await visibleHouse(id);
                }
                loadData();
            } catch (error) {
                console.error("Lỗi cập nhật trạng thái:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };

    const handleShowRooms = (hostel) => {
        setSelectedHostel(hostel);
        setIsRoomModalOpen(true);
    };

    const handleViewDetail = (id) => navigate(`/houses/${id}`);

    const handleViewRoomDetail = (houseId, roomId) => {
        setIsRoomModalOpen(false);
        navigate(`/houses/${houseId}/rooms/${roomId}`);
    };

    const openEditHouseModal = (hostel) => {
        setEditingHouse(hostel);
        setShowEditHouseModal(true);
    };

    const openDeleteHouseModal = (hostel) => {
        setDeletingHouse(hostel);
        setShowDeleteHouseModal(true);
    };

    const openAddRoomModal = () => {
        setShowAddRoomModal(true);
    }

    const openEditRoomModal = (room) => {
        setEditingRoom(room);
        setShowEditRoomModal(true);
    };

    const openDeleteRoomModal = (room) => {
        setDeletingRoom(room);
        setShowDeleteRoomModal(true);
    };


    const filteredHostels = hostels.filter(
        (h) =>
            (h.name && h.name.toLowerCase().includes(search.toLowerCase())) ||
            (h.address && h.address.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredHostels.length / itemsPerPage);
    const currentHostels = filteredHostels.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading)
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Đang tải dữ liệu nhà trọ...</p>
            </div>
        );
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-4 shadow-sm mb-3">
                <h2 className="fw-bold text-primary m-0">
                    <i className="bi bi-house-door me-2"></i> Quản lý nhà trọ
                </h2>
                <div>
                    <button className="btn btn-primary" onClick={() => setShowAddHouseModal(true)}>
                        <i className="bi bi-plus-lg me-2"></i> Thêm nhà trọ
                    </button>
                </div>
            </div>

            <input
                type="search"
                className="form-control mb-3"
                placeholder="Tìm nhà trọ theo tên hoặc địa chỉ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="table-responsive">
                <table className="table table-hover align-middle bg-white shadow-sm rounded">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Tên nhà trọ</th>
                            <th>Chủ trọ</th>
                            <th>Địa chỉ</th>
                            <th>Số phòng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentHostels.map((h, i) => (
                            <tr key={h.id || i}>
                                <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                <td>{h.name}</td>
                                <td>
                                    {h.userName}
                                    <div className="mt-1">
                                        <span className={`badge bg-${h.status === "visible" ? "success" : "secondary"}`}>
                                            {h.status === "visible" ? "Đang hiện" : "Đã ẩn"}
                                        </span>
                                    </div>
                                </td>
                                <td>{h.address}</td>
                                <td>
                                    <button
                                        className="badge bg-info text-dark border-0"
                                        onClick={() => handleShowRooms(h)}
                                    >
                                        {h.rooms.length} phòng
                                    </button>
                                </td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <button
                                            className={`btn btn-sm btn-${h.status === "visible" ? "warning" : "success"}`}
                                            onClick={() => handleToggleStatus(h.id, h.status)}
                                            title={h.status === "visible" ? "Ẩn nhà trọ" : "Hiện nhà trọ"}
                                        >
                                            <i className={`bi bi-eye${h.status === "visible" ? "-slash" : ""}-fill`}></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleViewDetail(h.id)}
                                            title="Xem chi tiết"
                                        >
                                            <i className="bi bi-info-circle-fill"></i>
                                        </button>
                                        <button className="btn btn-sm btn-success" onClick={() => openEditHouseModal(h)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => openDeleteHouseModal(h)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxButtons={5}
            />

            {showAddHouseModal && <AddHostelModal show={showAddHouseModal} onClose={() => setShowAddHouseModal(false)} onAdded={loadData} />}
            {showEditHouseModal && <EditHostelModal show={showEditHouseModal} house={editingHouse} onClose={() => setShowEditHouseModal(false)} onUpdated={loadData} />}
            {showDeleteHouseModal && <DeleteHouseModal show={showDeleteHouseModal} house={deletingHouse} onClose={() => setShowDeleteHouseModal(false)} onDeleted={loadData} />}
            
            {showAddRoomModal && selectedHostel && <AddRoomModal show={showAddRoomModal} houseId={selectedHostel.id} ownerId={selectedHostel.user_Id} onClose={() => setShowAddRoomModal(false)} onAdd={() => { loadData(); setIsRoomModalOpen(false); }} />}
            {showEditRoomModal && <EditRoomModal show={showEditRoomModal} room={editingRoom} houseId={selectedHostel.id} onClose={() => setShowEditRoomModal(false)} onUpdated={() => { loadData(); setIsRoomModalOpen(false); }} />}
            {showDeleteRoomModal && <DeleteRoomModal show={showDeleteRoomModal} room={deletingRoom} onClose={() => setShowDeleteRoomModal(false)} onDeleted={() => { loadData(); setIsRoomModalOpen(false); }} />}

            {isRoomModalOpen && selectedHostel && (
                <>
                    <div className="modal fade show" style={{ display: "block" }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        DS Phòng - {selectedHostel.name}
                                    </h5>
                                    <button className="btn btn-primary ms-2" onClick={openAddRoomModal}>
                                        <i className="bi bi-plus-lg me-2"></i> Thêm phòng vào nhà trọ này
                                    </button>
                                    <button className="btn-close" onClick={() => setIsRoomModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {selectedHostel.rooms.length === 0 ? (
                                        <p className="text-center text-muted">Chưa có phòng nào.</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Tên phòng</th>
                                                        <th>Giá</th>
                                                        <th>Trạng thái</th>
                                                        <th>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedHostel.rooms.map((r, index) => (
                                                        <tr key={r.room_Id || index}>
                                                            <td>{r.room_Id}</td>
                                                            <td>{r.title}</td>
                                                            <td>
                                                                {r.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(r.price) : "0 ₫"}
                                                            </td>
                                                            <td>
                                                                <span className={`badge bg-${r.status === "visible" ? "success" : "secondary"}`}>
                                                                    {r.status === "visible" ? "Đang hiện" : "Đã ẩn"}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleViewRoomDetail(selectedHostel.id, r.room_Id)}
                                                                >
                                                                    <i className="bi bi-arrow-right-short"></i> Xem
                                                                </button>
                                                                <button className="btn btn-sm btn-success ms-1" onClick={() => openEditRoomModal(r)}>
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </button>
                                                                <button className="btn btn-sm btn-danger ms-1" onClick={() => openDeleteRoomModal(r)}>
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setIsRoomModalOpen(false)}>
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
}
