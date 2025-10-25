import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rooms as fetchHouses, getFavorite, postFavorite } from '../../../api/api.jsx';
import StarRating from '../../../components/StarRating.jsx';
import Breadcrumbs from '../../../components/Breadcrumbs.jsx';

function HouseDetail() {
    // Đổi tên biến: id trong URL giờ là houseId
    const { id: houseId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;

    const [housesData, setHousesData] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const placeholder = 'https://s3.tech12h.com/sites/default/files/styles/inbody400/public/field/image/no-image-available.jpg';

    // 1. Fetch dữ liệu House (Hook 1)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch API
                const data = await fetchHouses();
                setHousesData(data);
            } catch (error) {
                console.error("Error loading house data:", error);
            } finally {
                setLoading(false);
            }
        };
        const checkFavorite = async () => {
            try {
                const res = await getFavorite(userId, houseId);
                setIsFavorite(res);
            } catch (err) {
                console.error('Error checking favorite:', err);
            }
        };
        if (houseId) checkFavorite();
        loadData();
    }, [houseId]);

    // Hàm toggle yêu thích
    const toggleFavorite = async () => {
        try {
            await postFavorite(userId, houseId);
            setIsFavorite(prev => !prev);
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };
    // 2. Tìm đối tượng House dựa trên houseId (Hook 2)
    const house = useMemo(() => {
        if (!housesData || housesData.length === 0) return null;
        // Chuyển đổi houseId sang chuỗi để so sánh
        return housesData.find((h) => String(h.house_Id) === String(houseId));
    }, [housesData, houseId]);

    // 3. Tính toán dữ liệu hiển thị
    const rooms = house?.rooms || [];
    const mainRoom = rooms[0];
    const images = mainRoom?.roomImages?.map(img => img.imageUrl) || [placeholder];

    // Tính rating trung bình của TẤT CẢ các phòng trong nhà trọ
    const allReviews = rooms.flatMap(r => r.reviews || []);
    const averageRating = allReviews.length
        ? +(allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
        : 0;

    // Tìm khoảng giá thấp nhất và cao nhất
    const prices = rooms.map(r => r.price).filter(p => typeof p === 'number') || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
    let priceDisplay = 'Liên hệ';
    if (minPrice && maxPrice) {
        if (minPrice === maxPrice) {
            priceDisplay = `${minPrice.toLocaleString('vi-VN')} ₫/tháng`;
        } else {
            priceDisplay = `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} ₫/tháng`;
        }
    }
    const priceFormatted = priceDisplay;

    // Trích xuất tiện ích chung (tổng hợp từ tất cả các phòng)
    const uniqueHouseFeatures = new Set();
    const featureMap = {
        'has_AirConditioner': 'Điều hoà', 'has_Wifi': 'WiFi', 'has_Closet': 'Tủ quần áo',
        'has_Mezzanine': 'Gác xép', 'has_Hot_Water': 'Nước nóng', 'has_Pet': 'Thú cưng',
        'has_Fridge': 'Tủ lạnh', 'has_Window': 'Cửa sổ'
    };
    rooms.forEach(room => {
        const props = room.roomProperty;
        if (props) {
            Object.keys(featureMap).forEach(key => {
                const propKey = key.startsWith('has_') ? key : 'has_' + key;
                // Kiểm tra thuộc tính tồn tại và có giá trị true
                if (props[propKey]) {
                    uniqueHouseFeatures.add(featureMap[key]);
                }
            });
        }
    });
    const houseFeatures = Array.from(uniqueHouseFeatures);

    // Lấy ảnh đại diện và trạng thái ảnh
    // Dùng useState để lưu ảnh được chọn
    const [selected, setSelected] = useState(images[0]);

    // Trạng thái (Giả định nhà trọ còn phòng trống nếu availableRooms > 0)
    const availableRoomsCount = rooms.filter(r => r.status === 1).length;
    const houseStatus = availableRoomsCount > 0 ? 'Còn phòng' : 'Đã hết';
    const statusColor = availableRoomsCount > 0 ? 'success' : 'secondary';

    // ✅ ĐÃ SỬA VỊ TRÍ HOOK: Đảm bảo Hook này được gọi ở đầu, trước mọi lệnh return điều kiện.
    // Cập nhật selected image nếu images thay đổi (ví dụ: sau khi load data)
    useEffect(() => {
        if (images.length > 0 && selected !== images[0]) {
            setSelected(images[0]);
        }
    }, [images, selected]);

    // --- CÁC ĐIỀU KIỆN RETURN SỚM ---

    if (loading) {
        return (
            <main className="container py-5">
                <div className="text-center text-muted">Đang tải chi tiết nhà trọ...</div>
            </main>
        );
    }

    if (!house) {
        return (
            <main className="container py-5">
                <div className="alert alert-warning">
                    Không tìm thấy nhà trọ.
                    <button
                        className="btn btn-link p-0 ms-2"
                        onClick={() => navigate('/houses')}
                        aria-label="Quay lại danh sách"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </main>
        );
    }

    // --- RENDER CHÍNH ---

    return (
        <main className="container py-4 room-detail-page">
            <Breadcrumbs
                items={[
                    { label: 'Trang chủ', to: '/' },
                    { label: 'Tìm nhà trọ', to: '/houses' },
                    { label: house.house_Name || `Nhà trọ ${house.house_Id}`, active: true },
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
                                alt={house.house_Name || 'House image'}
                                className="gallery-cover-image"
                                loading="lazy"
                            />

                            <div className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-2">
                                {/* Trạng thái nhà trọ */}
                                <span className={`badge rounded-pill text-white bg-${statusColor}`}>
                                    {houseStatus} ({availableRoomsCount}/{rooms.length})
                                </span>

                                {/* Icon yêu thích */}
                                <i
                                    className={`fa${isFavorite ? 's' : 'r'} fa-heart fs-3 text-danger cursor-pointer`}
                                    onClick={toggleFavorite}
                                    title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                                ></i>
                            </div>
                        </div>


                        {images.length > 1 && (
                            <>
                                <div className="thumb-break mx-3" />

                                <div className="gallery-thumbs-row d-flex gap-2 p-3 overflow-auto">
                                    {images.slice(0, 6).map((url, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`gallery-thumb btn p-0 ${selected === url ? 'active' : ''}`}
                                            onClick={() => setSelected(url)}
                                        >
                                            <img src={url} alt={`thumb-${idx + 1}`} className="gallery-thumb-img" style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
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
                                <h1 className="h4 fw-bold mb-1">{house.house_Name}</h1>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <StarRating rating={averageRating} />
                                    <span className="fs-8 text-secondary">({allReviews.length || 0} đánh giá)</span>
                                </div>
                                <p className="text-secondary mb-3">
                                    <i className="fas fa-map-marker-alt me-2" aria-hidden="true" />
                                    {house.street}, {house.commune}, {house.province}
                                </p>
                            </header>

                            <hr />

                            <section aria-labelledby="house-details-heading">
                                <h2 id="house-details-heading" className="h6 fw-bold mt-4 mb-3">Tiện ích chung của nhà trọ</h2>

                                {/* Tiện ích chung */}
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {houseFeatures.map((f, index) => (
                                        <span key={index} className="badge bg-primary-subtle text-primary fw-medium px-3 py-2 rounded-pill">
                                            {f}
                                        </span>
                                    ))}
                                    {house.is_Elevator && (
                                        <span className="badge bg-info-subtle text-info fw-medium px-3 py-2 rounded-pill">
                                            Có Thang máy
                                        </span>
                                    )}
                                </div>
                            </section>

                            <hr />

                            <section aria-labelledby="house-desc-heading">
                                <h2 id="house-desc-heading" className="h6 fw-bold mt-4 mb-2">Mô tả nhà trọ</h2>
                                <p className="text-secondary mb-0">{house.description || 'Không có mô tả.'}</p>
                                {house.note && <p className="small text-secondary mt-2 mb-0">Ghi chú: {house.note}</p>}
                            </section>
                        </div>
                    </article>

                    {/* Danh sách các phòng trong nhà trọ */}
                    <article className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h2 className="h6 fw-bold mb-3">Các phòng hiện có ({rooms.length})</h2>
                            <div className="row g-3">
                                {rooms.map((room) => (
                                    // Bọc phòng bằng HouseCard/RoomCard để liên kết đến trang chi tiết phòng
                                    <Link to={`/houses/${house.house_Id}/rooms/${room.room_Id}`} key={room.room_Id} className="room-link text-decoration-none col-12 col-md-6 col-lg-4">
                                        {/* Lưu ý: HouseCard được dùng ở đây cần được tùy chỉnh để hiển thị Room */}
                                        <p className="fw-semibold mb-1">{room.title}</p>
                                        <p className="text-secondary small">Giá: {new Intl.NumberFormat('vi-VN').format(room.price)} ₫</p>
                                    </Link>
                                ))}
                                {rooms.length === 0 && <p className="text-muted m-0">Nhà trọ này hiện chưa có phòng nào được đăng.</p>}
                            </div>
                        </div>
                    </article>

                    {/* Reviews */}
                    <article className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h2 className="h6 fw-bold mb-3">Đánh giá chung ({allReviews.length || 0})</h2>

                            {allReviews.length ? (
                                <div className="d-flex flex-column gap-3">
                                    {/* Hiển thị tất cả đánh giá của TẤT CẢ các phòng */}
                                    {allReviews.map((rv, index) => (
                                        <div key={index} className="py-2 border-bottom">
                                            <div className="d-flex align-items-center mb-1">
                                                <strong className="me-2">{rv.user || 'Người dùng ẩn danh'}</strong>
                                                <StarRating rating={rv.rating} small />
                                                <span className="text-secondary ms-2 fs-8">{rv.rating}/5</span>
                                            </div>
                                            <div className="text-secondary">{rv.comment || 'Không có bình luận.'}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary m-0">Chưa có đánh giá nào cho nhà trọ này.</p>
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
                                    Giá: {priceFormatted}
                                </div>
                                <div className="d-grid gap-2 mt-3">
                                    <button className="btn btn-primary btn-lg">Liên hệ thuê phòng</button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            const q = encodeURIComponent(`${house.street}, ${house.commune}, ${house.province}`);
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
                        {house.userName && (
                            <div className="card shadow-sm mb-4">
                                <div className="card-body d-flex align-items-center gap-3">
                                    <img
                                        src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAIVBMVEXU1NS2trazs7O6urrX19e9vb3Ly8vQ0NDHx8fExMTAwMDjuXZ+AAAEY0lEQVR4nO2d25akIAxFVW7q/3/wgLZV5XiXhBNd2U/9WHtFIARIV5WiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKNzYCPo3ZBMVgu+63kX6rvOheqxU8L2pm0g9MPxlel89zieE1kwWc5rGtSGgf98FgndrHl+cf4pOCsq+S4yPaR+gY6PKkclI1JE+eo4+sPnHhv61e9jgToblLzhObnCsv6Qy6HihNvbsaJnZtDJt+usqiR79u5fY6sLIn+PE5QThtku0EbbkBHe4Tm7TCLO5OV4mRI2bLiMuQ2w6tMEHm+uSbIRMAtZnu0QbKatnvkoCbTFgMwf/RC8gNNbTuNS1gA8t3EjI1jH41aajcqlr+PxMFxgBoSEMDDw0lIGBh6aldKnrFiqTkywvaRzShWyNmUDWa/IzzDnQ7Dlje7kO8DujSJfnNLjvrKWXwc1nPb0MbgNNumKOGJRLIA9MDA0qCXiVDPmSWeOmM0uaMU8yoDIN1eZ/DqgUYMnX/4QDVQJ4ZDAuHMsMbKGxPDKgMfMqmVdNADxTM8blXesMcWlmBHWUTr/RBG41X5U1E50yzUG5cOQzuPIMddkMWjh7VamJ9gwgATwHCNS1pqYHHmpQVwGBNUD67wx72kRc04CeA9JdAhgBXwWgnAKAheaBGxdmt8FfpSVMaaAnmgnC0OADQ7h5lnC3kWqtgV82GaBJN4Ep5gyK6Rk9LX/JdxFyqzGRXwzAbf2XZGc1QgbMSKaNKJfMu1rYm1krZNiIc4k2NxdPI9Dl2kPAL1KfBN6ob0ArGAdcrQoKemqyJG4ILug0EpL+Xdr1x+YrKtC60llOVmwkf2G/dIeztHmKSsI7sylkjNTpeAsb2j692v4dQelv43r5T+eXxF/s2y4afXB91/pK3HvZk6ReJsF/CNVzu5t8eUXfGUVRFEUUaWEJacVsP6R1M1RPSwGGvmZjKrPIMVNK85w+Z/F3+s7ttQYyznX+GT6+i/E42G02MUad9H2ADcf7sp8IdYI3A/Zy8xmpnaesvdV7pok68nxCf7Ys85+NvDpgaI/G/I5OLamlXpyLr9T+VnSMmIaUturvh2UKTi/ExlO8o28klJ9sdaLR5Ckb06KDYymfasA/NdKXGuCLDW9qO0EzXH5sYO+0baB2STagZI3BZbCByLA8BgR9afRtGv5sAHMa/XOTj03pUzWex3MTZR/RkV5nXlL2SD2wPNH8UnS/xjdgRkoOG47mGf9RbkNAm5GtUS5Lo+9qtGJT6i4K60w2USgR4B79I4XmgBIqiQIqBP2Mz1GknU4hl2jDrmJLTGV/Muwpmi2lkuCWKbD4f2FOA3iagGzB3RykyII5wbtw8u7JlrBOATxNgLZhbQ9E381gH9a6U+GvjPU1CksXwF04U5qiE3OCsYaW809m7sH4z1x4C0xrGL4k4O5LrAwZvhmg+PjnfMvBVSvfhrGKzl9iWsiwlZzKT2aM01npZCbBldAwl/43ZJgOBFRGZe7K/AMP3jg3/bxeIgAAAABJRU5ErkJggg=='}
                                        alt={house.userName}
                                        width="64"
                                        height="64"
                                        className="rounded-circle"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div className="fw-semibold">{house.userName}</div>
                                        <div className="text-secondary fs-8">Chủ trọ</div>
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
                                            house.latitude && house.longitude
                                                ? `https://maps.google.com/maps?q=${house.latitude},${house.longitude}&hl=vi&z=16&output=embed`
                                                : `https://maps.google.com/maps?q=${encodeURIComponent(
                                                    house.address || house.title
                                                )}&hl=vi&z=16&output=embed`
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
            {/* CSS bổ sung */}
            <style>{`
                .gallery-cover-image {
                    width: 100%;
                    height: 50vh; 
                    max-height: 500px;
                    object-fit: cover;
                    border-radius: var(--bs-card-border-radius) var(--bs-card-border-radius) 0 0;
                }
                .image-badge {
                    position: absolute;
                    bottom: 1rem;
                    left: 1rem;
                    font-size: 0.9rem;
                    padding: 0.5rem 1rem;
                }
                .gallery-thumb {
                    width: 64px;
                    height: 64px;
                    border: 2px solid transparent;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .gallery-thumb.active {
                    border-color: var(--bs-primary);
                    box-shadow: 0 0 0 2px var(--bs-primary);
                }
                .gallery-thumb-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .thumb-break {
                    height: 1px;
                    background-color: var(--bs-gray-300);
                }
                .fs-8 { font-size: 0.85rem; }
                .fs-9 { font-size: 0.75rem; }
                .cursor-pointer {
                cursor: pointer;
                }

                .gallery-cover-image {
                width: 100%;
                height: auto;
                border-radius: 0.5rem;
                }

            `}</style>
        </main>
    );
}

export default HouseDetail;
