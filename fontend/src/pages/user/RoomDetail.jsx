import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rooms } from '../../api/room.js';
import StarRating from '../../component/StarRating.jsx';
import Breadcrumbs from '../../component/Breadcrumbs.jsx';

function RoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const room = useMemo(() => rooms.find((r) => String(r.id) === String(id)), [id]);
    const placeholder = 'https://via.placeholder.com/1200x700?text=No+Image';

    if (!room) {
        return (
            <main className="container py-5">
                <div className="alert alert-warning">
                    Không tìm thấy phòng.
                    <button
                        className="btn btn-link p-0 ms-2"
                        onClick={() => navigate(-1)}
                        aria-label="Quay lại"
                    >
                        Quay lại
                    </button>
                </div>
            </main>
        );
    }

    const images = room.images && room.images.length ? room.images : [placeholder];
    const [selected, setSelected] = useState(images[0]);

    const averageRating = room.reviews?.length
        ? +(room.reviews.reduce((s, r) => s + r.rating, 0) / room.reviews.length).toFixed(1)
        : 0;

    const priceFormatted = new Intl.NumberFormat('vi-VN').format(Number(room.price || 0));

    return (
        <main className="container py-4 room-detail-page">
            <Breadcrumbs
                items={[
                    { label: 'Trang chủ', to: '/' },
                    { label: 'Tìm phòng', to: '/rooms' },
                    { label: room.title || `Phòng ${room.id}`, active: true },
                ]}
            />
            <div className="row">
                {/* Cột trái */}
                <section className="col-lg-8">
                    {/* Gallery */}
                    <article className="card shadow-sm mb-4 gallery-card">
                        <div className="gallery-main-hero position-relative">
                            <img
                                src={selected}
                                alt={room.title || 'Room image'}
                                className="gallery-cover-image"
                                loading="lazy"
                            />
                            <span className={`image-badge badge bg-${room.statusColor || 'secondary'}`}>
                                {room.status || 'Trạng thái'}
                            </span>
                        </div>

                        {images.length > 1 && (
                            <>                          {/* thumb break (visual separator) */}
                                <div className="thumb-break mx-3" />

                                <div className="gallery-thumbs-row d-flex gap-2 p-3">
                                    {images.slice(0, 6).map((url, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`gallery-thumb btn p-0 ${selected === url ? 'active' : ''}`}
                                            onClick={() => setSelected(url)}
                                        >
                                            <img src={url} alt={`thumb-${idx + 1}`} className="gallery-thumb-img" />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </article>

                    {/* Info */}
                    <article className="card shadow-sm mb-4">
                        <div className="card-body">
                            <header>
                                <h1 className="h4 fw-bold mb-1">{room.title}</h1>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <StarRating rating={averageRating} />
                                    <span className="fs-8 text-secondary">({room.reviews?.length || 0} đánh giá)</span>
                                </div>
                                <p className="text-secondary mb-3">
                                    <i className="fas fa-map-marker-alt me-2" aria-hidden="true" />
                                    {room.address || room.location || 'Địa chỉ chưa có'}
                                </p>
                            </header>

                            <hr />

                            <section aria-labelledby="room-details-heading">
                                <h2 id="room-details-heading" className="h6 fw-bold mt-4 mb-2">Thông tin chi tiết</h2>

                                {/* Bootstrap 5 horizontal pills (responsive) */}
                                <div className="d-flex flex-wrap gap-3 mb-3">
                                    <div className="d-inline-flex align-items-center px-3 py-2 bg-light border rounded-pill">
                                        <i className="fas fa-bed me-2 text-primary" aria-hidden="true" />
                                        <span className="fw-medium">{room.properties?.bedCount || 1} giường</span>
                                    </div>

                                    <div className="d-inline-flex align-items-center px-3 py-2 bg-light border rounded-pill">
                                        <i className="fas fa-wifi me-2 text-primary" aria-hidden="true" />
                                        <span className="fw-medium">{room.properties?.HasWifi ? 'Có WiFi' : 'Không WiFi'}</span>
                                    </div>

                                    <div className="d-inline-flex align-items-center px-3 py-2 bg-light border rounded-pill">
                                        <i className="fas fa-snowflake me-2 text-primary" aria-hidden="true" />
                                        <span className="fw-medium">{room.properties?.HasAirConditioner ? 'Có điều hoà' : 'Không điều hoà'}</span>
                                    </div>
                                    <div className="d-inline-flex align-items-center px-3 py-2 bg-light border rounded-pill">
                                        <i className="fas fa-door-closed me-2 text-primary" aria-hidden="true" />
                                        <span className="fw-medium">{room.properties?.HasCloset ? 'Có tủ quần áo' : 'Không tủ quần áo'}</span>
                                    </div>
                                        <div className="d-inline-flex align-items-center px-3 py-2 bg-light border rounded-pill">
                                        <i className="fas fa-fan me-2 text-primary" aria-hidden="true" />
                                        <span className="fw-medium">{room.properties?.HasMezzanine ? 'Có gác xép' : 'Không gác xép'}</span>
                                    </div>
                                    <div className="d-inline-flex align-items-center px-3 py-2 bg-light border rounded-pill">
                                        <i className="fas fa-shower me-2 text-primary" aria-hidden="true" />
                                        <span className="fw-medium">{room.properties?.HasHotWater ? 'Có nước nóng' : 'Không nước nóng'}</span>
                                    </div>
                                    <div className="d-inline-flex align-items-center px-3 py-2 bg-light border rounded-pill">
                                        <i className="fas fa-dog me-2 text-primary" aria-hidden="true" />
                                        <span className="fw-medium">{room.properties?.HasPet ? 'Cho phép nuôi thú cưng' : 'Không cho nuôi thú cưng'}</span>
                                    </div>
                                    

                                    {room.area && (
                                        <div className="d-inline-flex align-items-center px-3 py-2 bg-light border rounded-pill">
                                            <i className="fas fa-vector-square me-2 text-primary" aria-hidden="true" />
                                            <span className="fw-medium">{room.area} m²</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <hr />

                            <section aria-labelledby="room-desc-heading">
                                <h2 id="room-desc-heading" className="h6 fw-bold mt-4 mb-2">Mô tả phòng</h2>
                                <p className="text-secondary mb-0">{room.description || 'Không có mô tả.'}</p>
                                {room.properties?.note && <p className="small text-secondary mt-2 mb-0">Ghi chú: {room.properties.note}</p>}
                            </section>
                        </div>
                    </article>

                    {/* Reviews */}
                    <article className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h2 className="h6 fw-bold mb-3">Đánh giá của khách ({room.reviews?.length || 0})</h2>

                            {room.reviews?.length ? (
                                <div className="d-flex flex-column gap-3">
                                    {room.reviews.map((rv) => (
                                        <div key={rv.id} className="py-2 border-bottom">
                                            <div className="d-flex align-items-center mb-1">
                                                <strong className="me-2">{rv.user}</strong>
                                                <StarRating rating={rv.rating} small />
                                                <span className="text-secondary ms-2 fs-8">{rv.rating}/5</span>
                                            </div>
                                            <div className="text-secondary">{rv.comment}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary m-0">Chưa có đánh giá nào cho phòng này.</p>
                            )}
                        </div>
                    </article>
                </section>

                {/* Cột phải */}
                <aside className="col-lg-4">
                    <div className="sticky-top" style={{ top: 'calc(var(--header-height, 64px) + 1rem)' }}>
                        {/* Giá phòng */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body text-center">
                                <div className="h4 fw-bold text-primary">
                                    Giá: {priceFormatted}₫ / tháng
                                </div>
                                <div className="d-grid gap-2 mt-3">
                                    <button className="btn btn-primary btn-lg">Đặt phòng</button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            const q = encodeURIComponent(room.address || room.location || room.title);
                                            window.open(
                                                `https://www.google.com/maps/search/?api=1&query=${q}`,
                                                '_blank',
                                                'noopener,noreferrer'
                                            );
                                        }}
                                    >
                                        Xem trên bản đồ
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chủ trọ */}
                        {room.host && (
                            <div className="card shadow-sm mb-4">
                                <div className="card-body d-flex align-items-center gap-3">
                                    <img
                                        src={room.host.avatar || 'https://via.placeholder.com/64?text=Host'}
                                        alt={room.host.name || 'Host'}
                                        width="64"
                                        height="64"
                                        className="rounded-circle"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div className="fw-semibold">{room.host.name || 'Chủ nhà'}</div>
                                        <div className="text-secondary fs-8">Chủ trọ</div>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline-secondary btn-sm">Nhắn tin</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bản đồ */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="h6 fw-bold mb-2">Vị trí trên bản đồ</h3>
                                <div className="ratio ratio-4x3">
                                    <iframe
                                        title="Bản đồ vị trí"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={
                                            room.latitude && room.longitude
                                                ? `https://maps.google.com/maps?q=${room.latitude},${room.longitude}&hl=vi&z=16&output=embed`
                                                : `https://maps.google.com/maps?q=${encodeURIComponent(
                                                    room.address || room.location || room.title
                                                )}&hl=vi&z=16&output=embed`
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

export default RoomDetail;