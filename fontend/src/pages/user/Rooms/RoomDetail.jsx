import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rooms as fetchHouses } from '../../../api/room.jsx';
import StarRating from '../../../component/StarRating.jsx';
import Breadcrumbs from '../../../component/Breadcrumbs.jsx';

function RoomDetail() {
    // Trích xuất cả houseId và roomId từ URL
    const { houseId, roomId } = useParams();
    const navigate = useNavigate();

    // Sửa lỗi cú pháp: Thêm tên biến và giá trị khởi tạo cho useState
    const [housesData, setHousesData] = useState([]); // Dữ liệu của tất cả các nhà trọ
    const [loading, setLoading] = useState(true);
    const placeholder = 'https://s3.tech12h.com/sites/default/files/styles/inbody400/public/field/image/no-image-available.jpg';
    // Sửa lỗi cú pháp: Thêm tên biến và giá trị khởi tạo cho useState (ảnh được chọn)
    const [selectedImage, setSelectedImage] = useState(placeholder); 


    // 1. Fetch dữ liệu House (Hook 1)
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchHouses();
                setHousesData(data);
            } catch (error) {
                console.error("Error loading house data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    // Sửa lỗi Dependency Array: useEffect gọi API fetch data chỉ nên chạy MỘT LẦN khi component mount
    }, []); 

    // 2. Tìm đối tượng House và Room dựa trên houseId và roomId (Hook 2 - useMemo)
    const { house, room } = useMemo(() => {
        // Sửa lỗi cú pháp: Thay | thành || trong điều kiện kiểm tra housesData
        if (!housesData || housesData.length === 0) return { house: null, room: null };

        // Bước 1: Tìm House (Sử dụng String() để so sánh kiểu dữ liệu)
        const foundHouse = housesData.find((h) => String(h.house_Id) === String(houseId));
        if (!foundHouse) return { house: null, room: null };

        // Bước 2: Tìm Room trong House đã tìm thấy (Sử dụng String() để so sánh kiểu dữ liệu)
        const foundRoom = foundHouse.rooms.find((r) => String(r.room_Id) === String(roomId));

        return { house: foundHouse, room: foundRoom };
    // Sửa lỗi Dependency Array: useMemo phải phụ thuộc vào housesData, houseId, và roomId
    }, [housesData, houseId, roomId]);

    // --- Tính toán dữ liệu hiển thị của Room ---
    
    // Sửa lỗi cú pháp: Thay | thành || trong toán tử nullish coalescing
    const reviews = room?.reviews || []; 
    const images = room?.roomImages?.map(img => img.imageUrl) || [placeholder];
    
    // Tính rating trung bình CỦA PHÒNG NÀY
    const averageRating = reviews.length
        ? +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // Định dạng giá phòng cụ thể
    const priceFormatted = room?.price
        ? `${room.price.toLocaleString('vi-VN')} ₫/tháng`
        : 'Liên hệ';
    
    // Trạng thái phòng (Giả định 1 = còn trống)
    const isAvailable = room?.status === 1;
    const roomStatus = isAvailable? 'Còn trống' : 'Đã thuê/Hết phòng';
    const statusColor = isAvailable? 'success' : 'secondary';


    // Trích xuất tiện ích (Hợp nhất tiện ích phòng và tiện ích nhà trọ)
    const uniqueRoomFeatures = new Set();
    const featureMap = {
        'has_AirConditioner': 'Điều hoà', 'has_Wifi': 'WiFi', 'has_Closet': 'Tủ quần áo',
        'has_Mezzanine': 'Gác xép', 'has_Hot_Water': 'Nước nóng', 'has_Pet': 'Thú cưng',
        'has_Fridge': 'Tủ lạnh', 'has_Window': 'Cửa sổ'
    };
    
    // 1. Tiện ích từ thuộc tính phòng
    const props = room?.roomProperty;
    if (props) {
        Object.keys(featureMap).forEach(key => {
            // Không cần sửa 'has_' vì các keys trong featureMap đều có 'has_'
            // const propKey = key.startsWith('has_')? key : 'has_' + key;
            if (props[key]) { // Sử dụng key trực tiếp vì nó khớp với tên thuộc tính trong props
                uniqueRoomFeatures.add(featureMap[key]);
            }
        });
    }
    const roomFeatures = Array.from(uniqueRoomFeatures);
    // 2. Tiện ích nhà trọ (Thang máy)
    const hasElevator = house?.is_Elevator;


    // Quản lý ảnh được chọn
    // Biến state đã được khai báo ở trên: selectedImage, setSelectedImage
    // const = useState(images); // Bỏ dòng này vì đã khai báo

    // Cập nhật selected image nếu images thay đổi
    useEffect(() => {
        // Sửa lỗi: Lấy ảnh đầu tiên trong mảng images làm ảnh được chọn ban đầu
        if (images.length > 0 && selectedImage !== images[0]) {
            setSelectedImage(images[0]); // Đặt ảnh đầu tiên
        }
    // Sửa lỗi Dependency Array: Phụ thuộc vào mảng images và selectedImage
    // images có thể thay đổi khi data load xong. selectedImage thay đổi để tránh loop vô hạn
    }, [images]); 


    // --- CÁC ĐIỀU KIỆN RETURN SỚM ---

    if (loading) {
        return (
            <main className="container py-5">
                <div className="text-center text-muted">Đang tải chi tiết phòng...</div>
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

    // Nếu tìm thấy nhà trọ nhưng không tìm thấy phòng, điều hướng về trang chi tiết nhà trọ
    if (!room) {
        return (
            <main className="container py-5">
                <div className="alert alert-warning">
                    Không tìm thấy phòng số {roomId} trong nhà trọ này.
                    <button
                        className="btn btn-link p-0 ms-2"
                        onClick={() => navigate(`/houses/${houseId}`)}
                        aria-label="Quay lại trang nhà trọ"
                    >
                        Quay lại trang chi tiết nhà trọ
                    </button>
                </div>
            </main>
        );
    }
    
    // --- KHAI BÁO BREADCRUMBS CUỐI CÙNG TRƯỚC RENDER CHÍNH ---
    // Hoàn thiện Breadcrumbs data sau khi đã có house và room
    const breadcrumbItems = [
        { label: 'Trang chủ', path: '/' },
        { label: 'Danh sách nhà trọ', path: '/houses' },
        { label: house.house_Name || `Nhà trọ ID: ${house.house_Id}`, path: `/houses/${houseId}` },
        { label: room.title || `Phòng ${room.room_Id}`, path: `/houses/${houseId}/rooms/${roomId}`, active: true },
    ];
    // Sửa lỗi cú pháp: Sửa lỗi cú pháp trong hàm mở Google Maps
    const handleViewOnMap = () => {
        const address = `${house.street}, ${house.commune}, ${house.province}`;
        const q = encodeURIComponent(address);
        // Sửa lỗi URL Google Maps: Bỏ "https://www.google.com/maps/search/?api=1&query=$" và thay bằng URL Maps chuẩn
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${q}`,
            '_blank',
            'noopener,noreferrer'
        );
    };


    // --- RENDER CHÍNH ---

    return (
        <main className="container py-4 room-detail-page">
            <Breadcrumbs
                items={breadcrumbItems} // Đã sửa: Truyền biến breadcrumbItems vào
            />
            <div className="row">
                {/* Cột trái (8 cột) */}
                <section className="col-lg-8">
                    {/* Gallery */}
                    <article className="card shadow-sm mb-4 gallery-card">
                        <div className="gallery-main-hero position-relative">
                            <img
                                src={selectedImage} // Đã sửa: Sử dụng selectedImage
                                alt={room.title || 'Room image'} // Đã sửa lỗi cú pháp | thành ||
                                className="gallery-cover-image"
                                loading="lazy"
                            />
                            <span className={`position-absolute top-0 end-0 m-2 badge rounded-pill text-white bg-${statusColor}`}
                                >
                                {roomStatus}
                            </span>
                        </div>

                        {images.length > 1 && (
                            <>
                                <div className="thumb-break mx-3" />

                                <div className="gallery-thumbs-row d-flex gap-2 p-3 overflow-auto">
                                    {images.slice(0, 6).map((url, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            // Đã sửa: So sánh với selectedImage
                                            className={`gallery-thumb btn p-0 ${selectedImage === url? 'active' : ''}`} 
                                            onClick={() => setSelectedImage(url)} // Đã sửa: Sử dụng setSelectedImage
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
                                <h1 className="h4 fw-bold mb-1">{room.title || `Phòng ${room.room_Id}`}</h1> {/* Đã sửa lỗi cú pháp | thành || */}
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <StarRating rating={averageRating} />
                                    <span className="fs-8 text-secondary">({reviews.length || 0} đánh giá)</span> {/* Đã sửa lỗi cú pháp | thành || */}
                                </div>
                                {/* Địa chỉ là thuộc tính của House */}
                                <p className="text-secondary mb-3">
                                    <i className="fas fa-map-marker-alt me-2" aria-hidden="true" />
                                    {house.street}, {house.commune}, {house.province}
                                </p>
                            </header>

                            <hr />

                            <section aria-labelledby="room-details-heading">
                                <h2 id="room-details-heading" className="h6 fw-bold mt-4 mb-3">Tiện ích của phòng</h2>

                                {/* Tiện ích phòng cụ thể + Tiện ích chung */}
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {roomFeatures.map((f, index) => (
                                        <span key={index} className="badge bg-primary-subtle text-primary fw-medium px-3 py-2 rounded-pill">
                                            {f}
                                        </span>
                                    ))}
                                    {hasElevator && (
                                        <span className="badge bg-info-subtle text-info fw-medium px-3 py-2 rounded-pill">
                                            Có Thang máy
                                        </span>
                                    )}
                                </div>
                            </section>

                            <hr />

                            <section aria-labelledby="room-desc-heading">
                                <h2 id="room-desc-heading" className="h6 fw-bold mt-4 mb-2">Mô tả phòng</h2>
                                <p className="text-secondary mb-0">{room.description || 'Không có mô tả chi tiết cho phòng này.'}</p> {/* Đã sửa lỗi cú pháp | thành || */}
                                {room.note && <p className="small text-secondary mt-2 mb-0">Ghi chú: {room.note}</p>}
                            </section>
                        </div>
                    </article>


                    {/* Reviews */}
                    <article className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h2 className="h6 fw-bold mb-3">Đánh giá của phòng ({reviews.length || 0})</h2> {/* Đã sửa lỗi cú pháp | thành || */}

                            {reviews.length ? (
                                <div className="d-flex flex-column gap-3">
                                    {/* Hiển thị chỉ đánh giá của phòng này */}
                                    {reviews.map((rv, index) => (
                                        <div key={index} className="py-2 border-bottom">
                                            <div className="d-flex align-items-center mb-1">
                                                <strong className="me-2">{rv.user || 'Người dùng ẩn danh'}</strong> {/* Đã sửa lỗi cú pháp | thành || */}
                                                <StarRating rating={rv.rating} small />
                                                <span className="text-secondary ms-2 fs-8">{rv.rating}/5</span>
                                            </div>
                                            <div className="text-secondary">{rv.comment || 'Không có bình luận.'}</div> {/* Đã sửa lỗi cú pháp | thành || */}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary m-0">Chưa có đánh giá nào cho phòng này.</p>
                            )}
                        </div>
                    </article>
                </section>

                {/* Cột phải (4 cột) */}
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
                                        onClick={handleViewOnMap} // Đã sửa: Gọi hàm đã định nghĩa
                                    >
                                        Xem trên bản đồ
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chủ trọ (Thuộc tính của House) */}
                        {house.userName && (
                            <div className="card shadow-sm mb-4">
                                <div className="card-body d-flex align-items-center gap-3">
                                    <img
                                        src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAIVBMVEXU1NS2trazs7O6urrX19e9vb3Ly8vQ0NDHx8fExMTAwMDjuXZ+AAAEY0lEQVR4nO2d25akIAxFVW7q/3/wgLZV5XiXhBNd2U/9WHtFIARIV5WiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKNzYCPo3ZBMVgu+63kX6rvOheqxU8L2pm0g9MPxlel89zieE1kwWc5rGtSGgf99FgndrHl+cf4pOCsq+S4yPaR+gY6PKkcnI1JE+eo4+sPnHhv61e9jgToblLzhObnCsv6Qy6HihNvbsaJnZtDJt+usqiR79u5fY6sLIn+PE5QThtku0EbbkBHe4Tm7TCLO5OV4mRI2bLiMuQ2w6tMEHm+uSbIRMAtZnu0QbKatnvkoCbTFgMwf/RC8gNNbTuNS1gA8t3EjI1jH41aajcqlr+PxMFxgBoSEMDDw0lIGBh6aldKnrFiqTkywvaRzShWyNmUDWa/IzzDnQ7Dlje7kO8DujSJfnNLjvrKWXwc1nPb0MbgNNumKOGJRLIA9MDA0qCXiVDPmSWeOmM0uaMU8yoDIN1eZ/DqgUYMnX/4QDVQJ4ZDAuHMsMbKGxPDKgMfMqmVdNADxTM8blXesMcWlmBHWUTr/RBG41X5U1E50yzUG5cOQzuPIMddkMWjh7VamJ9gwgATwHCNS1pqYHHmpQVwGBNUD67wx72kRc04CeA9JdAhgBXwWgnAKAheaBGxdmt8FfpSVMaaAnmgnC0OADQ7h5lnC3kWqtgV82GaBJN4Ep5gyK6Rk9LXfJdxFyqzGRXwzAbf2XZGc1QgbMSKaNKJfMu1rYm1krZNiIc4k2NxdPI9Dl2kPAL1KfBN6ob0ArGAdcrQoKemqyJG4ILug0EpL+Xdr1x+YrKtC60llOVmwkf2G/dIeztHmKSsI7sylkjNTpeAsb2j692v4dQelv43r5T+eXxF/s2y4afXB91/pK3HvZk6ReJsF/CNVzu5t8eUXfGUVRFEUUaWEJacVsP6R1M1RPSwGGvmZjKrPIMVNK85w+Z/F3+s7ttQYyznX+GT6+i/E42G02MUad9H2ADcf7sp8IdYI3A/Zy8xmpnaesvdV7pok68nxCf7Ys85+NvDpgaI/G/I5OLamlXpyLr9T+VnSMmIaUturvh2UKTi/ExlO8o28klJ9sdaLR5Ckb06KDYymfasA/NdKXGuCLDW9qO0EzXH5sYO20baB2STagZI3BZbCByLA8BgR9afRtGv5sAHMa/XOTj03pUzWex3MTZR/RkV5nXlL2SD2wPNH8UnS/xjdgRkoOG47mGf9RbkNAm5GtUS5Lo+9qtGJT6i4K60w2USgR4B79I4XmgBIqiQIqBP2Mz1GknU4hl2jDrmJLTGV/Muwpmi2lkuCWKbD4f2FOA3iagGzB3RykyII5wbtw8u7JlrBOATxNgLZhbQ9E381gH9a6U+GvjPU1CksXwF04U5qiE3OCsYaW809m7sH4z1x4C0xrGL4k4O5LrAwZvhmg+PjnfMvBVSvfhrGKzl9iWsiwlZzKT2aM01npZCbBldAwl/43ZJgOBFRGZe7K/AMP3jg3/bxeIgAAAABJRU5ErkJggg=='}
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

                        {/* Bản đồ (Thuộc tính của House) */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="h6 fw-bold mb-2">Vị trí trên bản đồ</h3>
                                <div className="ratio ratio-4x3">
                                    <iframe
                                        title="Bản đồ vị trí"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        // Sửa lỗi URL Google Maps: Sử dụng cú pháp string template và URL embed Maps chuẩn
                                        src={
                                            house.latitude && house.longitude
                                                ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${house.latitude},${house.longitude}&zoom=16`
                                                : `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                                                    house.address || house.house_Name
                                                )}&zoom=16`
                                            // LƯU Ý: Cần thay YOUR_API_KEY bằng Google Maps API Key thực tế để iframe hoạt động.
                                            // Sử dụng cách fallback search nếu không có lat/long.
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
            `}</style>
        </main>
    );
}

export default RoomDetail;