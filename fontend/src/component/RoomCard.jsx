import { useNavigate } from 'react-router-dom';
import { rooms } from '../api/room';

function RoomCard({ room }) {
    const navigate = useNavigate();

    // Chuyển các thuộc tính tiện nghi thành mảng feature
    const feature = [];
    if (room.properties?.HasWifi) feature.push('WiFi miễn phí');
    if (room.properties?.HasAirConditioner) feature.push('Điều hoà');
    if (room.properties?.HasMezzanine) feature.push('Gác xép');
    if (room.properties?.HasFridge) feature.push('Tủ lạnh');
    if (room.properties?.HasCloset) feature.push('Tủ quần áo');
    if (room.properties?.HasHotWater) feature.push('Nước nóng');
    if (room.properties?.HasWindow) feature.push('Cửa sổ');
    if (room.properties?.HasPet) feature.push('Cho phép nuôi thú cưng');
    // Thêm các tiện nghi khác nếu có
    // Nếu muốn tự động duyệt tất cả key:
    // Object.entries(room.properties || {}).forEach(([key, value]) => {
    //   if (value === true) feature.push(key);
    // });

    const avgRating = room.reviews?.length
        ? (room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)
        : null;

    return (
        <article className="card room-card h-100 shadow-sm border border-secondary-subtle">
            <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
                <img
                    src={room.images?.[0] || room.img}
                    alt={room.alt}
                    className="card-img-top"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                />
                <span
                    className={`position-absolute top-0 end-0 m-2 badge rounded-pill text-white ${room.statusColor}`}
                    style={{ fontSize: "0.625rem", fontWeight: "600", padding: "0.35em 0.75em" }}
                >
                    {room.status}
                </span>
            </div>
            <div className="card-body d-flex flex-column p-3">
                <h3
                    className="card-title d-flex fs-6 fw-semibold text-truncate line-clamp-2"
                    title={room.title}
                    style={{ minHeight: "2.4em" }}
                >
                    {room.title}
                </h3>

                <p className="text-secondary fs-8 mb-1 d-flex gap-1">
                    <i className="fas fa-map-marker-alt"></i> {room.address}
                </p>

                <div className="d-flex gap-1 mb-1">
                    <div className="d-flex gap-1">
                        <i className="fas fa-star text-yellow-400 fs-9"></i>
                        <span className="fs-8 fw-semibold">{avgRating}</span>
                    </div>
                    <span className="fs-8 text-secondary">({room.reviews?.length} đánh giá)</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="fs-5 fw-semibold text-dark mb-1">
                        {(typeof room.price === 'number' ? room.price.toLocaleString('vi-VN') : room.price)} <span>{room.unit}</span>
                    </p>

                    <p className="fs-8 text-secondary mb-2">
                        {room.area || "25m²"}
                    </p>
                </div>


                <div className="d-flex flex-wrap gap-1 fs-9 text-dark mb-2">
                    {feature.slice(0, 3).map((f, i) => (
                        <span
                            key={i}
                            className="border border-secondary-subtle rounded px-1 py-0"
                            style={{ fontSize: "0.5rem" }}
                        >
                            {f}
                        </span>
                    ))}
                    {feature.length > 3 && (
                        <span
                            className="border border-secondary-subtle rounded px-1 py-0"
                            style={{ fontSize: "0.5rem" }}
                        >
                            +{feature.length - 3} khác
                        </span>
                    )}
                </div>

                <div className="d-flex justify-content-between gap-2 mt-auto">
                    <div className="d-flex align-items-center gap-2">
                        <img
                            src={room.host.avatar}
                            alt={`Avatar of ${room.host.name}`}
                            className="rounded-circle"
                            width="20"
                            height="20"
                            style={{ objectFit: "cover" }}
                            loading="lazy"
                        />
                        <span className="fs-8 text-secondary truncate-text">{room.host.name}</span>
                        <i className="fas fa-check-circle text-success fs-9"></i>
                    </div>

                    <button className="btn btn-dark btn-sm btn-dark-custom w-10" aria-label={`Xem chi tiết ${room.title}`} onClick={() => navigate(`/rooms/${room.id}`)}>
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </article>
    );
}

export default RoomCard;
