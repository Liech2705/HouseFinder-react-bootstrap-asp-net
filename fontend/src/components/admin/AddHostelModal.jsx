import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { createHouse } from "../../api/api.jsx";

export default function AddHostelModal({ show, onClose, onAdded }) {
    const [formData, setFormData] = useState({
        user_Id: localStorage.getItem("id"),
        house_Name: "",
        description: "",
        is_Elevator: false,
        electric_Cost: 0,
        water_Cost: 0,
        province: "Cần Thơ",
        commune: "",
        street: "",
        latitude: 10.0452, // tọa độ mặc định Cần Thơ
        longitude: 105.7469,
        note: ""
    });

    const [currentLocation, setCurrentLocation] = useState({
        lat: 10.0452,
        lng: 105.7469
    });

    // Lấy vị trí hiện tại của người dùng
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
            await createHouse(formData);
            alert("✅ Thêm nhà trọ thành công!");
            onAdded();
            onClose();
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
                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Mô tả</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="2"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Mô tả ngắn..."
                                        />
                                    </div>

                                    {/* Bản đồ Google Maps */}
                                    <div className="col-md-12 mt-2">
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
