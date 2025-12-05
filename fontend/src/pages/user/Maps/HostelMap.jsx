import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// --- Cấu hình Icon (Fix lỗi icon mặc định của Leaflet trong React) ---
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const userIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// --- Component vẽ đường đi (Chỉ dùng khi có 1 nhà trọ) ---
// --- Component vẽ đường đi (Đã Fix lỗi Async) ---
const RoutingMachine = ({ userLocation, destination }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !userLocation || !destination) return;

        // Tạo instance routing
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation.lat, userLocation.lng),
                L.latLng(destination.latitude, destination.longitude),
            ],
            routeWhileDragging: false,
            lineOptions: {
                styles: [{ color: "blue", weight: 5 }],
            },
            show: true,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            createMarker: () => null,
        });

        // Thêm vào map
        routingControl.addTo(map);

        // Cleanup function: Chạy khi component bị hủy hoặc prop thay đổi
        return () => {
            try {
                // BƯỚC QUAN TRỌNG: Kiểm tra xem control có còn nằm trên map không trước khi xóa
                if (map && routingControl) {
                    // Cố gắng ngăn chặn các sự kiện vẽ lại nếu request trả về muộn
                    routingControl.getPlan().setWaypoints([]);

                    // Xóa control khỏi map
                    map.removeControl(routingControl);
                }
            } catch (e) {
                // Bắt lỗi nếu leaflet cố xóa layer không tồn tại
                console.warn("Lỗi cleanup routing (không ảnh hưởng trải nghiệm):", e);
            }
        };
    }, [map, userLocation, destination]);

    return null;
};

// --- Component tự động Zoom để thấy tất cả các Marker ---
const FitBounds = ({ hostels, userLocation }) => {
    const map = useMap();

    useEffect(() => {
        if (hostels.length === 0 && !userLocation) return;

        const bounds = L.latLngBounds();

        // Thêm vị trí các nhà trọ vào bounds
        hostels.forEach(h => {
            if (h.latitude && h.longitude) {
                bounds.extend([h.latitude, h.longitude]);
            }
        });

        // Thêm vị trí người dùng vào bounds
        if (userLocation) {
            bounds.extend([userLocation.lat, userLocation.lng]);
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [hostels, userLocation, map]);

    return null;
};

// --- Main Component ---
const HostelMap = ({ hostels = [] }) => {
    const [userLocation, setUserLocation] = useState(null);
    const defaultCenter = [10.0452, 105.7469]; // Trung tâm Cần Thơ

    // Lấy vị trí người dùng
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Không thể lấy vị trí:", error);
                }
            );
        }
    }, []);

    // Logic: Chỉ vẽ đường khi danh sách filteredHouses chỉ còn đúng 1 kết quả
    const isSingleHostel = hostels.length === 1;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ width: "100%", height: "100%", minHeight: "500px", borderRadius: "8px" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marker Người dùng */}
            {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>Vị trí của bạn</Popup>
                </Marker>
            )}

            {/* Marker Các nhà trọ */}
            {hostels.map((house) => (
                <Marker
                    key={house.house_Id}
                    position={[house.latitude, house.longitude]}
                    icon={defaultIcon}
                >
                    <Popup>
                        <div style={{ minWidth: '200px' }}>
                            <h6 style={{ margin: '0 0 5px', color: '#0d6efd' }}>{house.house_Name}</h6>
                            <p style={{ margin: '0', fontSize: '13px' }}>
                                <strong>Địa chỉ:</strong> {house.street}, {house.commune}, {house.province}
                            </p>
                            <p style={{ margin: '5px 0 0', fontSize: '13px', color: 'red', fontWeight: 'bold' }}>
                                {/* Hiển thị giá thấp nhất của phòng trong nhà này */}
                                Giá từ: {house.rooms && house.rooms.length > 0
                                    ? Math.min(...house.rooms.map(r => r.price)).toLocaleString() + ' đ'
                                    : 'Liên hệ'}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Tự động Zoom */}
            <FitBounds hostels={hostels} userLocation={userLocation} />

            {/* Vẽ đường đi nếu chỉ có 1 nhà trọ */}
            {isSingleHostel && userLocation && hostels[0] && (
                <RoutingMachine
                    userLocation={userLocation}
                    destination={hostels[0]}
                />
            )}
        </MapContainer>
    );
};

export default HostelMap;