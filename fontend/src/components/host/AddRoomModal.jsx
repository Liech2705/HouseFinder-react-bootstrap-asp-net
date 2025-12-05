import { useState } from 'react';
import { api } from '../../api/api.jsx';

export default function AddRoomModal({ show, onClose, onAdd, houseId, ownerId }) {
    // State khởi tạo giá trị rỗng cho form thêm mới
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: null,
        status: 'visible', // Mặc định là hiển thị
        check_In_Default: '',
        images: [],
        property: {
            has_AirConditioner: false,
            has_Wifi: false,
            bed_Count: 0,
            has_Closet: false,
            has_Mezzanine: false,
            has_Fridge: false,
            has_Hot_Water: false,
            has_Window: false,
            has_Pet: false,
            note: ''
        }
    });
    const getMinDate = () => {
        const today = new Date();
        // Nếu bạn muốn bắt buộc phải là "Ngày mai" (lớn hơn hẳn ngày hiện tại), hãy bỏ comment dòng dưới:
        // today.setDate(today.getDate() + 1); 
        return today.toISOString().split('T')[0]; // Trả về dạng YYYY-MM-DD
    };
    const minDate = getMinDate();
    if (!show) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('property.')) {
            const key = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                property: {
                    ...prev.property,
                    [key]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
                }
            }));
            return;
        }
        if (name === 'price') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        // Tạo object tạm để preview ảnh
        const fileObjs = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...fileObjs] }));
    };

    const removeImage = (index) => {
        // Đang ở chế độ thêm mới, ảnh chưa lưu vào DB nên chỉ cần xóa khỏi state
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Tạo phòng trước để lấy Room ID
            const payload = {
                title: formData.title,
                owner_Id: ownerId,
                house_Id: houseId,
                description: formData.description || null,
                price: formData.price === null ? 0 : formData.price,
                status: formData.status === "available" ? 1 : 0,
                check_In_Default: formData.check_In_Default || null
            };
            console.log(payload);
            const response = await api.post(`/Rooms/`, payload);

            // QUAN TRỌNG: Lấy ID của phòng vừa tạo
            const newRoomId = response.data?.room_Id || response.data?.id;

            if (!newRoomId) {
                throw new Error("Không lấy được ID phòng sau khi tạo.");
            }

            // 2. Upload ảnh (nếu có) vào phòng vừa tạo
            if (Array.isArray(formData.images) && formData.images.length > 0) {
                const formDataImages = new FormData();
                formData.images.forEach((imgObj) => {
                    if (imgObj.file) {
                        formDataImages.append('imageRooms', imgObj.file);
                    }
                });

                if (formDataImages.getAll('imageRooms').length > 0) {
                    await api.post(`/RoomImages/${newRoomId}/images/upload`, formDataImages, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }

            // 3. Cập nhật thuộc tính (Property) cho phòng vừa tạo
            if (formData.property) {
                const propPayload = {
                    room_Id: newRoomId,
                    has_AirConditioner: !!formData.property.has_AirConditioner,
                    has_Wifi: !!formData.property.has_Wifi,
                    bed_Count: Number(formData.property.bed_Count) || 0,
                    has_Closet: !!formData.property.has_Closet,
                    has_Mezzanine: !!formData.property.has_Mezzanine,
                    has_Fridge: !!formData.property.has_Fridge,
                    has_Hot_Water: !!formData.property.has_Hot_Water,
                    has_Window: !!formData.property.has_Window,
                    has_Pet: !!formData.property.has_Pet,
                    note: formData.property.note || ''
                };
                // Gọi API cập nhật property theo ID mới
                await api.post(`/RoomProperties/`, propPayload);
            }

            alert('✅ Thêm phòng mới thành công!');
            onAdd && onAdd(); // Refresh danh sách ở component cha
            onClose && onClose(); // Đóng modal
        } catch (err) {
            console.error(err);
            alert('❌ Lỗi khi thêm phòng: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block', zIndex: 9999 }}>
                <div className="modal-dialog modal-lg modal-dialog-centered" style={{ marginTop: '80px' }}>
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header bg-success text-white rounded-top-4">
                            <h5 className="modal-title fw-bold">➕ Thêm phòng mới</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body bg-light">
                                <div className="row g-3">
                                    <div className="col-md-6" required>
                                        <label className="form-label fw-semibold">Tiêu đề <span className="text-danger">*</span></label>
                                        <input name="title" required className="form-control" value={formData.title} onChange={handleChange} placeholder="VD: Phòng 201 - Có ban công" />
                                    </div>
                                    <div className="col-md-6" required>
                                        <label className="form-label fw-semibold">Giá (VNĐ) <span className="text-danger">*</span></label>
                                        <input name="price" type="number" required min={0} className="form-control" value={formData.price ?? ''} onChange={handleChange} placeholder="VD: 3000000" />
                                    </div>
                                    <div className="col-md-6" required>
                                        <label className="form-label fw-semibold">Trạng thái</label>
                                        <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                                            <option value="available">Còn trống</option>
                                            <option value="maintenance">Đang sửa chữa</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6" required>
                                        <label className="form-label fw-semibold">Ngày vào ở dự kiến</label>
                                        <input
                                            name="check_In_Default"
                                            type="date"
                                            className="form-control"
                                            value={formData.check_In_Default || ''}
                                            onChange={handleChange}
                                            min={minDate} // Chỉ cho chọn từ ngày hiện tại trở đi
                                        />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Mô tả chi tiết</label>
                                        <textarea name="description" className="form-control" rows={3} value={formData.description} onChange={handleChange} placeholder="Mô tả về diện tích, hướng phòng, tiện ích xung quanh..." />
                                    </div>

                                    <div className="col-md-12" required>
                                        <label className="form-label fw-semibold">Ảnh phòng</label>
                                        <div className="mb-3">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="form-control"
                                                onChange={handleImageUpload}
                                            />
                                            <small className="text-muted d-block mt-1">Chọn một hoặc nhiều ảnh để tải lên.</small>
                                        </div>

                                        {/* Preview ảnh đã chọn */}
                                        {formData.images.length > 0 && (
                                            <div className="mb-3">
                                                <h6>Ảnh đã chọn ({formData.images.length})</h6>
                                                <div className="row g-2">
                                                    {formData.images.map((imgObj, idx) => (
                                                        <div key={idx} className="col-md-3 position-relative">
                                                            <div className="card">
                                                                <img
                                                                    src={imgObj.url}
                                                                    alt={`preview-${idx}`}
                                                                    className="card-img-top"
                                                                    style={{ height: '100px', objectFit: 'cover' }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                                                    style={{ padding: '0px 6px' }}
                                                                    onClick={() => removeImage(idx)}
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-12" required>
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-header bg-white fw-bold">Tiện ích & Thuộc tính</div>
                                            <div className="card-body">
                                                <div className="row g-2">
                                                    <div className="col-md-4 form-check">
                                                        <input id="has_AirConditioner" type="checkbox" name="property.has_AirConditioner" className="form-check-input" checked={!!formData.property.has_AirConditioner} onChange={handleChange} />
                                                        <label htmlFor="has_AirConditioner" className="form-check-label ms-2">Máy lạnh</label>
                                                    </div>
                                                    <div className="col-md-4 form-check">
                                                        <input id="has_Wifi" type="checkbox" name="property.has_Wifi" className="form-check-input" checked={!!formData.property.has_Wifi} onChange={handleChange} />
                                                        <label htmlFor="has_Wifi" className="form-check-label ms-2">Wifi</label>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="input-group input-group-sm">
                                                            <span className="input-group-text">Số giường</span>
                                                            <input name="property.bed_Count" type="number" min={0} className="form-control" value={formData.property.bed_Count} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 form-check">
                                                        <input id="has_Closet" type="checkbox" name="property.has_Closet" className="form-check-input" checked={!!formData.property.has_Closet} onChange={handleChange} />
                                                        <label htmlFor="has_Closet" className="form-check-label ms-2">Tủ quần áo</label>
                                                    </div>
                                                    <div className="col-md-4 form-check">
                                                        <input id="has_Mezzanine" type="checkbox" name="property.has_Mezzanine" className="form-check-input" checked={!!formData.property.has_Mezzanine} onChange={handleChange} />
                                                        <label htmlFor="has_Mezzanine" className="form-check-label ms-2">Gác lửng</label>
                                                    </div>
                                                    <div className="col-md-4 form-check">
                                                        <input id="has_Fridge" type="checkbox" name="property.has_Fridge" className="form-check-input" checked={!!formData.property.has_Fridge} onChange={handleChange} />
                                                        <label htmlFor="has_Fridge" className="form-check-label ms-2">Tủ lạnh</label>
                                                    </div>
                                                    <div className="col-md-4 form-check">
                                                        <input id="has_Hot_Water" type="checkbox" name="property.has_Hot_Water" className="form-check-input" checked={!!formData.property.has_Hot_Water} onChange={handleChange} />
                                                        <label htmlFor="has_Hot_Water" className="form-check-label ms-2">Nước nóng</label>
                                                    </div>
                                                    <div className="col-md-4 form-check">
                                                        <input id="has_Window" type="checkbox" name="property.has_Window" className="form-check-input" checked={!!formData.property.has_Window} onChange={handleChange} />
                                                        <label htmlFor="has_Window" className="form-check-label ms-2">Cửa sổ</label>
                                                    </div>
                                                    <div className="col-md-4 form-check">
                                                        <input id="has_Pet" type="checkbox" name="property.has_Pet" className="form-check-input" checked={!!formData.property.has_Pet} onChange={handleChange} />
                                                        <label htmlFor="has_Pet" className="form-check-label ms-2">Cho nuôi thú</label>
                                                    </div>
                                                    <div className="col-12 mt-2">
                                                        <textarea name="property.note" className="form-control form-control-sm" rows={2} value={formData.property.note} onChange={handleChange} placeholder="Ghi chú thêm về tiện ích..." />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer bg-white border-top">
                                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Hủy bỏ</button>
                                <button type="submit" className="btn btn-success px-4"><i className="bi bi-plus-circle me-2"></i> Thêm mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}