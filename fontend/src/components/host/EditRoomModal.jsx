import { useState, useEffect } from 'react';
import { api } from '../../api/api.jsx';

export default function EditRoomModal({ show, onClose, onUpdated, room, houseId }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: null,
        status: 'visible',
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

    useEffect(() => {
        if (room) {
            // Derive server base (strip trailing '/api' if present)
            const apiBase = (api?.defaults?.baseURL || '').replace(/\/api\/?$/, '');

            const mappedImages = (room.roomImages || []).map(img => {
                const rel = img?.image_Url || img?.Image_Url || img?.imageUrl || '';
                if (!rel) return { id: img?.image_Id ?? img?.Image_Id ?? null, url: '' };
                const resolved = /^https?:\/\//i.test(rel) ? rel : `${apiBase}${rel}`;
                return { id: img?.image_Id ?? img?.Image_Id ?? null, url: resolved };
            });

            setFormData({
                title: room.title || '',
                description: room.description || '',
                price: room.price ?? null,
                status: room.status || 'visible',
                check_In_Default: room.check_In_Default || '',
                images: mappedImages,
                property: {
                    has_AirConditioner: room.roomProperty?.has_AirConditioner ?? false,
                    has_Wifi: room.roomProperty?.has_Wifi ?? false,
                    bed_Count: room.roomProperty?.bed_Count ?? 0,
                    has_Closet: room.roomProperty?.has_Closet ?? false,
                    has_Mezzanine: room.roomProperty?.has_Mezzanine ?? false,
                    has_Fridge: room.roomProperty?.has_Fridge ?? false,
                    has_Hot_Water: room.roomProperty?.has_Hot_Water ?? false,
                    has_Window: room.roomProperty?.has_Window ?? false,
                    has_Pet: room.roomProperty?.has_Pet ?? false,
                    note: room.roomProperty?.note ?? ''
                }
            });
        }
    }, [room]);

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
        if (name === 'check_In_Default') {
            setFormData(prev => ({ ...prev, [name]: value }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const fileObjs = files.map(f => ({ id: null, file: f, url: URL.createObjectURL(f) }));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...fileObjs] }));
    };

    const removeImage = async (index) => {
        const img = formData.images[index];
        // If the item has an id, it's an existing image in DB -> call delete endpoint
        if (img && img.id) {
            if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;
            try {
                await api.delete(`/RoomImages/${img.id}`);
                // After successful deletion from DB, trigger parent refresh
                onUpdated && onUpdated();
            } catch (err) {
                console.error('Failed to delete image:', err);
                alert('Không thể xóa ảnh trên server');
                return;
            }
        }

        // Remove from local state (for both new files and existing ones after successful delete)
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Build payload matching RoomUpdateDto
            const payload = {
                title: formData.title,
                description: formData.description || null,
                price: formData.price === null ? null : formData.price,
                status: formData.status === "available" ? 1 : 0,
                check_In_Default: formData.check_In_Default || null
            };
            await api.put(`/Rooms/${room.room_Id}`, payload);

            // Upload images as FormData (multipart/form-data)
            if (Array.isArray(formData.images) && formData.images.length > 0) {
                const formDataImages = new FormData();
                formData.images.forEach((imgObj) => {
                    // imgObj may be { id, url } for existing images, or { id:null, file, url }
                    if (imgObj && imgObj.file instanceof File) {
                        formDataImages.append('imageRooms', imgObj.file);
                    }
                });

                // Only upload if there are actual File objects
                if (formDataImages.getAll('imageRooms').length > 0) {
                    try {
                        // endpoint expects multiple files under 'imageRooms' (IFormFileCollection)
                        await api.post(`/RoomImages/${room.room_Id}/images/upload`, formDataImages, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    } catch (err) {
                        console.warn('Image upload failed:', err?.message || err);
                    }
                }
            }

            // Update property endpoint at /Rooms/{id}/property
            if (formData.property) {
                const propPayload = {
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
                await api.put(`/RoomProperties/${room.room_Id}`, propPayload).catch(err => {
                    console.warn('Property update failed:', err?.message || err);
                });
            }

            alert('✅ Cập nhật phòng thành công!');
            onUpdated && onUpdated();
            onClose && onClose();
        } catch (err) {
            console.error(err);
            alert('❌ Lỗi khi cập nhật phòng.');
        }
    };

    return (        
        <>
            <div className="modal fade show" style={{ display: 'block', zIndex: 9999 }}>
                <div className="modal-dialog modal-lg modal-dialog-centered" style={{ marginTop: '80px' }}>
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header bg-primary text-white rounded-top-4">
                            <h5 className="modal-title fw-bold">✏️ Sửa phòng</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body bg-light">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Tiêu đề</label>
                                        <input name="title" required className="form-control" value={formData.title} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Giá (VNĐ)</label>
                                        <input name="price" type="number" min={0} className="form-control" value={formData.price ?? ''} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Trạng thái</label>
                                        <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                                            <option value="available">Còn trống</option>
                                            <option value="maintenance">Đang sửa chữa</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Ngày vào ở mặc định</label>
                                        <input name="check_In_Default" type="date" className="form-control" value={formData.check_In_Default || ''} onChange={handleChange} />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Mô tả</label>
                                        <textarea name="description" className="form-control" rows={3} value={formData.description} onChange={handleChange} />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Ảnh phòng</label>
                                        <div className="mb-3">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="form-control"
                                                onChange={handleImageUpload}
                                            />
                                            <small className="text-muted d-block mt-1">Chọn một hoặc nhiều ảnh</small>
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
                                                                    src={imgObj && imgObj.file ? URL.createObjectURL(imgObj.file) : imgObj?.url}
                                                                    alt={`img-${idx}`}
                                                                    className="card-img-top"
                                                                    style={{ height: '120px', objectFit: 'cover' }}
                                                                />
                                                                <div className="card-body p-2">
                                                                    <small className="text-truncate d-block">
                                                                        {imgObj && imgObj.file ? imgObj.file.name : (imgObj?.url ? imgObj.url.split('/').pop() : '')}
                                                                    </small>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-danger w-100 mt-1"
                                                                        onClick={() => removeImage(idx)}
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-12">
                                        <h6>Thuộc tính phòng</h6>
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
                                                <label className="form-label">Số giường</label>
                                                <input name="property.bed_Count" type="number" min={0} className="form-control" value={formData.property.bed_Count} onChange={handleChange} />
                                            </div>
                                            <div className="col-md-4 form-check">
                                                <input id="has_Closet" type="checkbox" name="property.has_Closet" className="form-check-input" checked={!!formData.property.has_Closet} onChange={handleChange} />
                                                <label htmlFor="has_Closet" className="form-check-label ms-2">Tủ</label>
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
                                                <label className="form-label">Ghi chú thuộc tính</label>
                                                <textarea name="property.note" className="form-control" rows={2} value={formData.property.note} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer bg-white border-top">
                                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Đóng</button>
                                <button type="submit" className="btn btn-primary px-4"><i className="bi bi-pencil-square me-2"></i> Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}
