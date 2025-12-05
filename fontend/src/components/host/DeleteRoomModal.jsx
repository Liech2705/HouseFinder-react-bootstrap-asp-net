import { deleteRoom } from '../../api/api.jsx';

export default function DeleteRoomModal({ show, onClose, onDeleted, room }) {
    if (!show || !room) return null;
    console.log(room);
    const handleDelete = async () => {
        try {
            await deleteRoom(room.room_Id);
            alert('🗑️ Đã xóa phòng');
            onDeleted && onDeleted();
            onClose && onClose();
        } catch (err) {
            console.error(err);
            alert('❌ Lỗi khi xóa phòng');
        }
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block', zIndex: 9999 }}>
                <div className="modal-dialog modal-sm modal-dialog-centered" style={{ marginTop: '120px' }}>
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header bg-danger text-white rounded-top-4">
                            <h5 className="modal-title fw-bold">Xác nhận xóa</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body bg-light">
                            <p>Bạn có chắc muốn xóa phòng <strong>{room.title}</strong>?</p>
                            <p className="text-muted small">Hành động này không thể hoàn tác.</p>
                        </div>
                        <div className="modal-footer bg-white border-top">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Hủy</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}><i className="bi bi-trash me-1"></i> Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}
