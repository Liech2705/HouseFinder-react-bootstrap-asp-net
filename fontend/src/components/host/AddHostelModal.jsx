import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { createHouse, api } from "../../api/api.jsx";

export default function AddHostelModal({ show, onClose, onAdded }) {
    const [formData, setFormData] = useState({
        user_Id: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")).id
            : 0,
        house_Name: "",
        description: "",
        is_Elevator: false,
        electric_Cost: 0,
        water_Cost: 0,
        province: "Cần Thơ",
        commune: "",
        street: "",
        latitude: 10.0452,
        longitude: 105.7469,
        note: "",
        images: []
    });

    const [currentLocation, setCurrentLocation] = useState({
        lat: 10.0452,
        lng: 105.7469
    });

    // Lấy vị trí hiện tại
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                    setFormData((prev) => ({
                        ...prev,
                        latitude,
                        longitude
                    }));
                },
                () => console.warn("Không thể lấy vị trí người dùng.")
            );
        }
    }, []);

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createHouse(formData);
            console.log(res);
            const newHouseId = res.house_Id;

            if (!newHouseId) {
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
                    await api.post(`/HouseImages/${newHouseId}/images/upload`, formDataImages, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }
            alert("✅ Thêm nhà trọ thành công!");
            onAdded && onAdded();
            onClose && onClose();
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("❌ Lỗi khi thêm nhà trọ!");
        }
    };

    if (!show) return null;

    const mapContainerStyle = {
        width: "100%",
        height: "350px",
        borderRadius: "12px"
    };

    const center = {
        lat: formData.latitude || currentLocation.lat,
        lng: formData.longitude || currentLocation.lng
    };
    console.log(formData);
    return (
        <>
            <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-lg modal-dialog-centered" style={{ marginTop: "80px" }}>
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header bg-primary text-white rounded-top-4">
                            <h5 className="modal-title fw-bold">🏠 Thêm nhà trọ mới</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body bg-light">
                                <div className="row g-3">

                                    {/* Tên nhà trọ */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Tên nhà trọ</label>
                                        <input
                                            type="text"
                                            name="house_Name"
                                            className="form-control"
                                            required
                                            value={formData.house_Name}
                                            onChange={handleChange}
                                            placeholder="Nhập tên nhà trọ..."
                                        />
                                    </div>

                                    {/* Có thang máy */}
                                    <div className="col-md-6 d-flex align-items-end">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                name="is_Elevator"
                                                checked={formData.is_Elevator}
                                                onChange={handleChange}
                                                className="form-check-input"
                                                id="isElevator"
                                            />
                                            <label className="form-check-label" htmlFor="isElevator">
                                                Có thang máy
                                            </label>
                                        </div>
                                    </div>

                                    {/* Mô tả */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Mô tả</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="2"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Mô tả ngắn về nhà trọ..."
                                        />
                                    </div>

                                    {/* Chi phí điện & nước */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Giá điện (VNĐ/kWh)</label>
                                        <input
                                            type="number"
                                            name="electric_Cost"
                                            className="form-control"
                                            value={formData.electric_Cost}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Giá nước (VNĐ/m³)</label>
                                        <input
                                            type="number"
                                            name="water_Cost"
                                            className="form-control"
                                            value={formData.water_Cost}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                    </div>

                                    {/* Địa chỉ */}
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Tỉnh / Thành phố</label>
                                        <select
                                            name="province"
                                            className="form-select"
                                            value={formData.province}
                                            onChange={handleChange}
                                        >
                                            <option value="Cần Thơ">Cần Thơ</option>
                                            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                            <option value="Hà Nội">Hà Nội</option>
                                            <option value="Đà Nẵng">Đà Nẵng</option>
                                            <option value="An Giang">An Giang</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Phường / Xã</label>
                                        <input
                                            type="text"
                                            name="commune"
                                            className="form-control"
                                            value={formData.commune}
                                            onChange={handleChange}
                                            placeholder="Nhập phường/xã..."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Đường / Số nhà</label>
                                        <input
                                            type="text"
                                            name="street"
                                            className="form-control"
                                            value={formData.street}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ cụ thể..."
                                        />
                                    </div>

                                    {/* Bản đồ chọn vị trí */}
                                    <div className="col-md-12 mt-3">
                                        <label className="form-label fw-semibold">📍 Chọn vị trí trên bản đồ</label>
                                        <LoadScript googleMapsApiKey="AIzaSyDRVRcq5vXpgVwolVAdFYALHm3O0TVWI8U">
                                            <GoogleMap
                                                mapContainerStyle={mapContainerStyle}
                                                center={center}
                                                zoom={15}
                                                onClick={handleMapClick}
                                            >
                                                <Marker
                                                    position={{
                                                        lat: formData.latitude,
                                                        lng: formData.longitude
                                                    }}
                                                    draggable={true}
                                                    onDragEnd={(e) =>
                                                        handleMapClick({
                                                            latLng: {
                                                                lat: () => e.latLng.lat(),
                                                                lng: () => e.latLng.lng()
                                                            }
                                                        })
                                                    }
                                                />
                                            </GoogleMap>
                                        </LoadScript>
                                        <p className="mt-2 text-muted small">
                                            Nhấn vào bản đồ để chọn vị trí, hoặc kéo marker để thay đổi.
                                        </p>
                                    </div>

                                    {/* Tọa độ */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Vĩ độ (Latitude)</label>
                                        <input
                                            type="number"
                                            name="latitude"
                                            className="form-control"
                                            value={formData.latitude}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Kinh độ (Longitude)</label>
                                        <input
                                            type="number"
                                            name="longitude"
                                            className="form-control"
                                            value={formData.longitude}
                                            readOnly
                                        />
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

                                    {/* Ghi chú */}
                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Ghi chú</label>
                                        <textarea
                                            name="note"
                                            className="form-control"
                                            rows="2"
                                            value={formData.note}
                                            onChange={handleChange}
                                            placeholder="Nhập ghi chú (nếu có)..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer bg-white border-top">
                                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                    Đóng
                                </button>
                                <button type="submit" className="btn btn-primary px-4">
                                    <i className="bi bi-plus-circle me-2"></i>Thêm mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}
