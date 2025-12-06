import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getAndPostConversations, fetchHouseById as fetchHouses, checkBooking, fetchRoomsById, isPaymentCompleted, postReview } from '../../../api/api.jsx';
import { encodeBookingParams } from '../../../utils/encrypt.js';
import StarRating from '../../../components/StarRating.jsx';
import Breadcrumbs from '../../../components/Breadcrumbs.jsx';

function RoomDetail() {
    const { houseId, roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [house, setHouse] = useState({}); // Sửa: khởi tạo là object rỗng {} thay vì [] để an toàn hơn khi truy cập thuộc tính
    const [loading, setLoading] = useState(true);
    const placeholder = 'https://surl.li/drynzt';

    const [selectedImage, setSelectedImage] = useState(placeholder);
    const [roomStatus, setRoomStatus] = useState("Còn trống");
    const [statusColor, setStatusColor] = useState("success");
    const [isBooked, setIsBooked] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // --- STATE CHO REVIEW ---
    const [canReview, setCanReview] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [userComment, setUserComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [room, setRoom] = useState({}); // Sửa: khởi tạo object rỗng
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userObj = JSON.parse(userStr);
            setIsLogin(true);
            setCurrentUser(userObj);
        }
    }, []);

    // Fetch dữ liệu House và Room
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchHouses(houseId);
                setHouse(data);

                const roomdata = await fetchRoomsById(roomId);
                setRoom(roomdata);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [houseId, roomId]); // Dependency array rỗng là đúng để chạy 1 lần

    // KIỂM TRA QUYỀN ĐÁNH GIÁ (Đã thanh toán chưa)
    useEffect(() => {
        const checkReviewPermission = async () => {
            // Cần id của user và id của room
            const userId = currentUser?.id || currentUser?.user_Id;


            if (userId && roomId && room && Array.isArray(room.reviews)) {
                const alreadyReviewed = room.reviews.some(
                    (r) => r.user_Id === userId || r.User_Id === userId
                );
                setHasReviewed(alreadyReviewed);

                // Nếu đã review rồi thì không cần check payment nữa, chặn luôn
                if (alreadyReviewed) {
                    setCanReview(false);
                    return;
                }

                try {
                    const result = await isPaymentCompleted(userId, roomId);
                    // result trả về true nếu đã thanh toán

                    setCanReview(result == 'confirmed' ? true : false);
                } catch (error) {
                    console.error("Lỗi kiểm tra quyền đánh giá:", error);
                }
            }
        };

        if (currentUser) {
            checkReviewPermission();
        }
    }, [currentUser, roomId, room]);

    const convertImagesToDisplay = (imageUrl) => {
        return import.meta.env.VITE_URL_ROOT + imageUrl;
    }

    const reviews = room?.reviews || [];
    const images = useMemo(() => {
        return (room?.roomImages?.map(img => convertImagesToDisplay(img.image_Url)) || [placeholder]);
    }, [room?.roomImages]);

    const averageRating = reviews.length
        ? +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const priceFormatted = room?.price
        ? `${room.price.toLocaleString('vi-VN')} ₫/tháng`
        : 'Liên hệ';

    // 2. CẬP NHẬT LOGIC KIỂM TRA TRẠNG THÁI
    useEffect(() => {
        const checkRoomStatus = async () => {
            if (!room?.room_Id) return;
            try {
                // Giả định checkBooking trả về true nếu đã CÓ người đặt
                const bookedResult = await checkBooking(room.room_Id);

                setIsBooked(bookedResult); // Lưu vào state boolean
                setRoomStatus(!bookedResult ? 'Còn trống' : 'Đã thuê/Hết phòng');
                setStatusColor(!bookedResult ? 'success' : 'secondary');
            } catch (error) {
                console.error("Lỗi kiểm tra trạng thái phòng:", error);
            }
        };

        checkRoomStatus();
    }, [room?.room_Id]);

    // XỬ LÝ GỬI ĐÁNH GIÁ
    const handleSubmitReview = async () => {
        if (!userComment.trim()) {
            alert("Vui lòng nhập nội dung đánh giá");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const userId = currentUser?.id || currentUser?.user_Id;

            // Payload gửi đi
            const reviewData = {
                room_Id: parseInt(roomId),
                user_Id: parseInt(userId),
                rating: userRating,
                comment: userComment
            };

            await postReview(reviewData);

            alert("Đánh giá của bạn đã được gửi thành công!");
            setUserComment("");
            setCanReview(false); // Ẩn form sau khi đánh giá xong (hoặc load lại trang)

            // Reload lại data phòng để hiện review mới
            const updatedRoom = await fetchRoomsById(roomId);
            setRoom(updatedRoom);

        } catch (error) {
            console.error("Lỗi gửi đánh giá:", error);
            alert("Gửi đánh giá thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Component chọn sao (Interactive Star Rating)
    const InteractiveRating = ({ rating, setRating }) => {
        return (
            <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <i
                        key={star}
                        className={`bi bi-star-fill fs-4 cursor-pointer ${star <= rating ? 'text-warning' : 'text-secondary-subtle'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setRating(star)}
                    ></i>
                ))}
            </div>
        );
    };
    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [location.hash, reviews]);
    // Xử lý khi bấm nút Báo cáo bình luận
    const handleReportReview = (reviewId) => {
        if (!isLogin) {
            alert("Vui lòng đăng nhập để báo cáo vi phạm.");
            navigate('/login', { state: { from: location } });
            return;
        }
        // Chuyển hướng sang trang báo cáo với ID của review
        navigate(`/report/review/${reviewId}`);
    };

    // Các tiện ích
    const uniqueRoomFeatures = new Set();
    const featureMap = {
        'has_AirConditioner': 'Điều hoà', 'has_Wifi': 'WiFi', 'has_Closet': 'Tủ quần áo',
        'has_Mezzanine': 'Gác xép', 'has_Hot_Water': 'Nước nóng', 'has_Pet': 'Thú cưng',
        'has_Fridge': 'Tủ lạnh', 'has_Window': 'Cửa sổ'
    };

    const props = room?.roomProperty;
    if (props) {
        Object.keys(featureMap).forEach(key => {
            if (props[key]) {
                uniqueRoomFeatures.add(featureMap[key]);
            }
        });
    }
    const roomFeatures = Array.from(uniqueRoomFeatures);
    const hasElevator = house?.is_Elevator;

    // Cập nhật ảnh được chọn
    useEffect(() => {
        if (images.length > 0 && selectedImage === placeholder) {
            setSelectedImage(images[0]);
        }
    }, [images]); // Bỏ selectedImage khỏi dependency để tránh loop nếu placeholder thay đổi

    const openChatWithHost = async (hostid) => {
        try {
            let userid = JSON.parse(localStorage.getItem('user'))?.id;
            if (!userid) {
                alert("Vui lòng đăng nhập để chat với chủ trọ");
                return;
            }
            const response = await getAndPostConversations(hostid, userid);
            const convId = response.conversation_Id;
            window.dispatchEvent(new CustomEvent('openChat', {
                detail: { conversationId: convId, hostId: hostid }
            }));
        } catch (err) {
            console.error('Lỗi khi mở chat:', err);
            window.dispatchEvent(new CustomEvent('openChat', { detail: { hostId: hostid } }));
        }
    };

    // Điều kiện return sớm
    if (loading) return <main className="container py-5"><div className="text-center text-muted">Đang tải chi tiết phòng...</div></main>;
    if (!house || Object.keys(house).length === 0) return <main className="container py-5"><div className="alert alert-warning">Không tìm thấy nhà trọ. <button className="btn btn-link p-0 ms-2" onClick={() => navigate('/houses')}>Quay lại</button></div></main>;
    if (!room || Object.keys(room).length === 0) return <main className="container py-5"><div className="alert alert-warning">Không tìm thấy phòng. <button className="btn btn-link p-0 ms-2" onClick={() => navigate(`/houses/${houseId}`)}>Quay lại nhà trọ</button></div></main>;

    const breadcrumbItems = [
        { label: 'Trang chủ', to: '/' },
        { label: 'Tìm nhà trọ', to: '/houses' },
        { label: house.house_Name || `Nhà trọ ID: ${house.house_Id}`, to: `/houses/${houseId}` },
        { label: room.title || `Phòng ${room.room_Id}`, path: `/houses/${houseId}/rooms/${roomId}`, active: true },
    ];

    return (
        <main className="container py-4 room-detail-page">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="row">
                {/* Cột trái (8 cột) */}
                <section className="col-lg-8">
                    {/* Gallery */}
                    <article className="card shadow-sm mb-4 gallery-card">
                        <div className="gallery-main-hero position-relative">
                            <img
                                src={selectedImage}
                                alt={room.title || 'Room image'}
                                className="gallery-cover-image"
                                loading="lazy"
                            />
                            <span className={`position-absolute top-0 end-0 m-2 badge rounded-pill text-white bg-${statusColor}`}>
                                {roomStatus}
                            </span>
                        </div>

                        {images.length > 1 && (
                            <>
                                <div className="thumb-break mx-3" />
                                <div className="gallery-thumbs-row d-flex gap-2 p-3 overflow-auto">
                                    {images.slice(0, 10).map((url, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`gallery-thumb btn p-0 ${selectedImage === url ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(url)}
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
                                <h1 className="h4 fw-bold mb-1">{room.title || `Phòng ${room.room_Id}`}</h1>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <StarRating rating={averageRating} />
                                    <span className="fs-8 text-secondary">({reviews.length || 0} đánh giá)</span>
                                </div>
                                <p className="text-secondary mb-3">
                                    <i className="fas fa-map-marker-alt me-2" aria-hidden="true" />
                                    {house.street}, {house.commune}, {house.province}
                                </p>
                            </header>
                            <hr />
                            <section aria-labelledby="room-details-heading">
                                <h2 id="room-details-heading" className="h6 fw-bold mt-4 mb-3">Tiện ích của phòng</h2>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {roomFeatures.map((f, index) => (
                                        <span key={index} className="badge bg-primary-subtle text-primary fw-medium px-3 py-2 rounded-pill">
                                            {f}
                                        </span>
                                    ))}
                                    {hasElevator && (
                                        <span className="badge bg-info-subtle text-info fw-medium px-3 py-2 rounded-pill">Có Thang máy</span>
                                    )}
                                </div>
                            </section>
                            <hr />
                            <section aria-labelledby="room-desc-heading">
                                <h2 id="room-desc-heading" className="h6 fw-bold mt-4 mb-2">Mô tả phòng</h2>
                                <p className="text-secondary mb-0">{room.description || 'Không có mô tả chi tiết cho phòng này.'}</p>
                                {room.note && <p className="small text-secondary mt-2 mb-0">Ghi chú: {room.note}</p>}
                            </section>
                        </div>
                    </article>


                    {/* Reviews */}
                    <article className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h2 className="h6 fw-bold mb-3">Đánh giá của phòng ({reviews.length || 0})</h2>
                            {/* --- THÔNG BÁO NẾU ĐÃ ĐÁNH GIÁ --- */}
                            {hasReviewed && (
                                <div className="alert alert-success mb-4">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    Cảm ơn bạn đã đánh giá phòng trọ này!
                                </div>
                            )}
                            {/* --- FORM ĐÁNH GIÁ (Chỉ hiện khi đủ điều kiện) --- */}
                            {canReview && !hasReviewed && (
                                <div className="bg-light p-3 rounded mb-4 border">
                                    <h6 className="fw-bold mb-2">Viết đánh giá của bạn</h6>
                                    <div className="mb-3">
                                        <label className="form-label small text-secondary">Mức độ hài lòng</label>
                                        <InteractiveRating rating={userRating} setRating={setUserRating} />
                                    </div>
                                    <div className="mb-3">
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
                                            value={userComment}
                                            onChange={(e) => setUserComment(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="text-end">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleSubmitReview}
                                            disabled={isSubmittingReview}
                                        >
                                            {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* ------------------------------------------- */}
                            {reviews.length ? (
                                <div className="d-flex flex-column gap-3">
                                    {reviews.map((rv, index) => (
                                        <div key={index} id={rv.review_Id} className="py-2 border-bottom">
                                            <div className="d-flex justify-content-between align-items-start">
                                                {/* Thông tin người dùng & Rating */}
                                                <div className="d-flex align-items-center mb-1">
                                                    <strong className="me-2">{rv.user_Name || 'Người dùng ẩn danh'}</strong>
                                                    <StarRating rating={rv.rating} small />
                                                </div>

                                                {/* Nút Báo cáo (Chỉ hiện nếu không phải review của chính mình) */}
                                                {currentUser?.id !== rv.user_Id && (
                                                    <button
                                                        className="btn btn-link text-muted p-0 text-decoration-none fs-9"
                                                        onClick={() => handleReportReview(rv.review_Id || rv.id)} // Lưu ý kiểm tra đúng tên trường ID trong API trả về
                                                        title="Báo cáo vi phạm"
                                                    >
                                                        <i className="bi bi-flag me-1"></i> Báo cáo
                                                    </button>
                                                )}
                                            </div>

                                            {/* Nội dung bình luận */}
                                            <div className="text-dark">{rv.comment || 'Không có bình luận.'}</div>

                                            {/* Ngày tạo */}
                                            {rv.created_At && (
                                                <div className="text-muted fs-9 mt-1">
                                                    {new Date(rv.created_At).toLocaleDateString('vi-VN')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* ... code cũ ... */
                                <p className="text-secondary m-0">Chưa có đánh giá nào cho phòng này.</p>
                            )}
                        </div>
                    </article>
                </section>

                {/* Cột phải (4 cột) */}
                <aside className="col-lg-4">
                    <div className="sticky-top" style={{ top: 'calc(var(--header-height, 64px) + 1rem)' }}>
                        {/* Giá phòng & Nút đặt cọc */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body text-center">
                                <div className="h4 fw-bold text-primary">
                                    Giá: {priceFormatted}
                                </div>
                                <div className='h6 fw-medium mt-2'>
                                    Có thể dọn vào: {room.check_In_Default || new Date().toLocaleDateString('vi-VN')}
                                </div>
                                <div className="d-grid gap-2 mt-3">
                                    {room.owner_Id !== (JSON.parse(localStorage.getItem('user'))?.id) &&
                                        <button
                                            className={`btn ${isBooked ? 'btn-secondary' : 'btn-primary'} btn-bg`}
                                            disabled={isBooked} // Vô hiệu hóa nếu đã booked
                                            onClick={() => {

                                                if (isBooked) return;
                                                if (!isLogin) { navigate('/login', { state: { from: location }, replace: true }); } else {
                                                    const token = encodeBookingParams(house.house_Id, roomId);
                                                    navigate(`/booking/${token}`);
                                                }
                                            }}
                                        >
                                            {isBooked ? 'Tạm hết phòng' : 'Đặt cọc ngay'}
                                        </button>}

                                </div>
                            </div>
                        </div>

                        {/* Chủ trọ */}
                        {room.owner_Id !== (JSON.parse(localStorage.getItem('user'))?.id) && (
                            <div className="card shadow-sm mb-4">
                                <div className="card-body d-flex align-items-center gap-3">
                                    <img
                                        src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAIVBMVEXU1NS2trazs7O6urrX19e9vb3Ly8vQ0NDHx8fExMTAwMDjuXZ+AAAEY0lEQVR4nO2d25akIAxFVW7q/3/wgLZV5XiXhBNd2U/9WHtFIARIV5WiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKNzYCPo3ZBMVgu+63kX6rvOheqxU8L2pm0g9MPxlel89zieE1kwWc5rGtSGgf99FgndrHl+cf4pOCsq+S4yPaR+gY6PKkcnI1JE+eo4+sPnHhv61e9jgToblLzhObnCsv6Qy6HihNvbsaJnZtDJt+usqiR79u5fY6sLIn+PE5QThtku0EbbkBHe4Tm7TCLO5OV4mRI2bLiMuQ2w6tMEHm+uSbIRMAtZnu0QbKatnvkoCbTFgMwf/RC8gNNbTuNS1gA8t3EjI1jH41aajcqlr+PxMFxgBoSEMDDw0lIGBh6aldKnrFiqTkywvaRzShWyNmUDWa/IzzDnQ7Dlje7kO8DujSJfnNLjvrKWXwc1nPb0MbgNNumKOGJRLIA9MDA0qCXiVDPmSWeOmM0uaMU8yoDIN1eZ/DqgUYMnX/4QDVQJ4ZDAuHMsMbKGxPDKgMfMqmVdNADxTM8blXesMcWlmBHWUTr/RBG41X5U1E50yzUG5cOQzuPIMddkMWjh7VamJ9gwgATwHCNS1pqYHHmpQVwGBNUD67wx72kRc04CeA9JdAhgBXwWgnAKAheaBGxdmt8FfpSVMaaAnmgnC0OADQ7h5lnC3kWqtgV82GaBJN4Ep5gyK6Rk9LXfJdxFyqzGRXwzAbf2XZGc1QgbMSKaNKJfMu1rYm1krZNiIc4k2NxdPI9Dl2kPAL1KfBN6ob0ArGAdcrQoKemqyJG4ILug0EpL+Xdr1x+YrKtC60llOVmwkf2G/dIeztHmKSsI7sylkjNTpeAsb2j692v4dQelv43r5T+eXxF/s2y4afXB91/pK3HvZk6ReJsF/CNVzu5t8eUXfGUVRFEUUaWEJacVsP6R1M1RPSwGGvmZjKrPIMVNK85w+Z/F3+s7ttQYyznX+GT6+i/E42G02MUad9H2ADcf7sp8IdYI3A/Zy8xmpnaesvdV7pok68nxCf7Ys85+NvDpgaI/G/I5OLamlXpyLr9T+VnSMmIaUturvh2UKTi/ExlO8o28klJ9sdaLR5Ckb06KDYymfasA/NdKXGuCLDW9qO0EzXH5sYO+0baB2STagZI3BZbCByLA8BgR9afRtGv5sAHMa/XOTj03pUzWex3MTZR/RkV5nXlL2SD2wPNH8UnS/xjdgRkoOG47mGf9RbkNAm5GtUS5Lo+9qtGJT6i4K60w2USgR4B79I4XmgBIqiQIqBP2Mz1GknU4hl2jDrmJLTGV/Muwpmi2lkuCWKbD4f2FOA3iagGzB3RykyII5wbtw8u7JlrBOATxNgLZhbQ9E381gH9a6U+GvjPU1CksXwF04U5qiE3OCsYaW809m7sH4z1x4C0xrGL4k4O5LrAwZvhmg+PjnfMvBVSvfhrGKzl9iWsiwlZzKT2aM01npZCbBldAwl/43ZJgOBFRGZe7K/AMP3jg3/bxeIgAAAABJRU5ErkJggg=='}
                                        alt={room.ownerName}
                                        width="64"
                                        height="64"
                                        className="rounded-circle"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div className="fw-semibold">{room.ownerName}</div>
                                        <div className="text-secondary fs-8">Chủ trọ</div>
                                    </div>
                                    <button
                                        className="btn btn-primary btn-small"
                                        onClick={() => openChatWithHost(room.owner_Id)}
                                    >
                                        Liên hệ chủ trọ
                                    </button>
                                </div>
                            </div>
                        )}
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