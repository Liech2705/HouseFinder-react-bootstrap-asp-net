import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link

// Component nhận một đối tượng House duy nhất (chứ không phải Room)
function HouseCard({ house, view }) { // Nhận thêm prop 'view' từ HouseList
    const navigate = useNavigate();
    const houseData = house || {};

    // 1. TRÍCH XUẤT TIỆN ÍCH CHUNG & TỔNG HỢP TIỆN ÍCH CỦA TẤT CẢ PHÒNG
    const uniqueHouseFeatures = new Set();

    // Ánh xạ tên thuộc tính snake_case sang tiếng Việt
    const featureMap = {
        'has_Wifi': 'WiFi miễn phí',
        'has_AirConditioner': 'Điều hoà',
        'has_Mezzanine': 'Gác xép',
        'has_Fridge': 'Tủ lạnh',
        'has_Closet': 'Tủ quần áo',
        'has_Hot_Water': 'Nước nóng',
        'has_Window': 'Cửa sổ',
        'has_Pet': 'Cho phép nuôi thú cưng',
    };

    // Lặp qua tất cả các phòng trong nhà trọ để tìm các tiện ích độc nhất
    houseData.rooms?.forEach(room => {
        const properties = room.roomProperty;
        if (properties) {
            // Duyệt qua tất cả các key tiện ích và thêm vào Set nếu là TRUE
            Object.keys(featureMap).forEach(key => {
                if (properties[key]) {
                    uniqueHouseFeatures.add(featureMap[key]);
                }
            });
        }
    });

    const features = Array.from(uniqueHouseFeatures);

    // 2. TÍNH TOÁN THÔNG TIN TỔNG HỢP
    const totalRooms = houseData.rooms?.length || 0;
    const availableRooms = houseData.rooms?.filter(r => r.status === 1).length || 0;

    // Lấy tên chủ trọ (lấy từ trường userName của house)
    const hostName = houseData.userName || 'Chủ trọ ẩn danh';

    // Lấy ảnh đại diện (Lấy ảnh đầu tiên của phòng đầu tiên nếu có)
    const firstRoomImages = houseData.rooms?.[0]?.roomImages;
    const imageUrl = firstRoomImages?.[0]?.imageUrl || 'https://s3.tech12h.com/sites/default/files/styles/inbody400/public/field/image/no-image-available.jpg';
    const imageHost = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAIVBMVEXU1NS2trazs7O6urrX19e9vb3Ly8vQ0NDHx8fExMTAwMDjuXZ+AAAEY0lEQVR4nO2d25akIAxFVW7q/3/wgLZV5XiXhBNd2U/9WHtFIARIV5WiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKNzYCPo3ZBMVgu+63kX6rvOheqxU8L2pm0g9MPxlel89zieE1kwWc5rGtSGgf98FgndrHl+cf4pOCsq+S4yPaR+gY6PKkclI1JE+eo4+sPnHhv61e9jgToblLzhObnCsv6Qy6HihNvbsaJnZtDJt+usqiR79u5fY6sLIn+PE5QThtku0EbbkBHe4Tm7TCLO5OV4mRI2bLiMuQ2w6tMEHm+uSbIRMAtZnu0QbKatnvkoCbTFgMwf/RC8gNNbTuNS1gA8t3EjI1jH41aajcqlr+PxMFxgBoSEMDDw0lIGBh6aldKnrFiqTkywvaRzShWyNmUDWa/IzzDnQ7Dlje7kO8DujSJfnNLjvrKWXwc1nPb0MbgNNumKOGJRLIA9MDA0qCXiVDPmSWeOmM0uaMU8yoDIN1eZ/DqgUYMnX/4QDVQJ4ZDAuHMsMbKGxPDKgMfMqmVdNADxTM8blXesMcWlmBHWUTr/RBG41X5U1E50yzUG5cOQzuPIMddkMWjh7VamJ9gwgATwHCNS1pqYHHmpQVwGBNUD67wx72kRc04CeA9JdAhgBXwWgnAKAheaBGxdmt8FfpSVMaaAnmgnC0OADQ7h5lnC3kWqtgV82GaBJN4Ep5gyK6Rk9LX/JdxFyqzGRXwzAbf2XZGc1QgbMSKaNKJfMu1rYm1krZNiIc4k2NxdPI9Dl2kPAL1KfBN6ob0ArGAdcrQoKemqyJG4ILug0EpL+Xdr1x+YrKtC60llOVmwkf2G/dIeztHmKSsI7sylkjNTpeAsb2j692v4dQelv43r5T+eXxF/s2y4afXB91/pK3HvZk6ReJsF/CNVzu5t8eUXfGUVRFEUUaWEJacVsP6R1M1RPSwGGvmZjKrPIMVNK85w+Z/F3+s7ttQYyznX+GT6+i/E42G02MUad9H2ADcf7sp8IdYI3A/Zy8xmpnaesvdV7pok68nxCf7Ys85+NvDpgaI/G/I5OLamlXpyLr9T+VnSMmIaUturvh2UKTi/ExlO8o28klJ9sdaLR5Ckb06KDYymfasA/NdKXGuCLDW9qO0EzXH5sYO+0baB2STagZI3BZbCByLA8BgR9afRtGv5sAHMa/XOTj03pUzWex3MTZR/RkV5nXlL2SD2wPNH8UnS/xjdgRkoOG47mGf9RbkNAm5GtUS5Lo+9qtGJT6i4K60w2USgR4B79I4XmgBIqiQIqBP2Mz1GknU4hl2jDrmJLTGV/Muwpmi2lkuCWKbD4f2FOA3iagGzB3RykyII5wbtw8u7JlrBOATxNgLZhbQ9E381gH9a6U+GvjPU1CksXwF04U5qiE3OCsYaW809m7sH4z1x4C0xrGL4k4O5LrAwZvhmg+PjnfMvBVSvfhrGKzl9iWsiwlZzKT2aM01npZCbBldAwl/43ZJgOBFRGZe7K/AMP3jg3/bxeIgAAAABJRU5ErkJggg==';
    // Xử lý địa chỉ
    const fullAddress = `${houseData.street || ''}, ${houseData.commune || ''}, ${houseData.province || ''}`;

    // Xử lý giá (Tìm giá thấp nhất và cao nhất)
    const prices = houseData.rooms?.map(r => r.price).filter(p => typeof p === 'number') || [];
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

    return (
        <article className="card house-card h-100 shadow-sm border border-secondary-subtle">
            {/* ✅ ĐÃ SỬA: Bọc toàn bộ nội dung trừ phần chân thẻ bằng Link */}
            <Link 
                to={`/houses/${houseData.house_Id}`} 
                className="text-decoration-none text-dark d-flex flex-column h-100"
                style={{ flexGrow: 1 }} // Cho phép link chiếm hết không gian
            >
                <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
                    <img
                        src={imageUrl}
                        alt={houseData.house_Name}
                        className="card-img-top"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                    />
                    {/* Hiển thị số phòng còn trống */}
                    <span
                        className={`position-absolute top-0 end-0 m-2 badge rounded-pill text-white ${availableRooms > 0 ? 'bg-success' : 'bg-secondary'}`}
                        style={{ fontSize: "0.625rem", fontWeight: "600", padding: "0.35em 0.75em" }}
                    >
                        {availableRooms} phòng trống / {totalRooms}
                    </span>
                    {/* Badge: Có Thang máy */}
                    {houseData.is_Elevator && (
                        <span
                            className="position-absolute end-0 mt-5 me-2 badge rounded-pill"
                            style={{
                                fontSize: "0.625rem",
                                fontWeight: "600",
                                padding: "0.35em 0.75em",
                                backgroundColor: "#e3f2fd", // xanh nhẹ
                                color: "#0d6efd", // chữ xanh dương
                                boxShadow: "0 0 6px rgba(13,110,253,0.25)", // viền nhẹ
                            }}
                        >
                            Có Thang máy
                        </span>
                        )}
                </div>
                <div className="card-body d-flex flex-column p-3">
                    <h3
                        className="card-title fs-6 fw-semibold"
                        title={houseData.house_Name}
                    >
                        {houseData.house_Name}
                    </h3>

                    <p className="card-address text-secondary fs-8 mb-2 d-flex gap-1">
                        <i className="fas fa-map-marker-alt"></i> {fullAddress}
                    </p>

                    {/* Thông tin chung về nhà trọ */}
                    <div className="d-flex flex-column justify-content-between align-items-center mb-2">
                        <p className="price-house fs-5 fw-semibold text-primary mb-0">
                            {priceDisplay}
                        </p>
                    </div>

                    {/* Hiển thị các tiện ích độc nhất có trong toàn bộ nhà trọ */}
                    <div className="d-flex flex-wrap gap-1 fs-9 text-dark mb-3">
                        {features.slice(0, 4).map((f, i) => (
                            <span
                                key={i}
                                className="border border-secondary-subtle rounded px-1 py-0 text-muted"
                                style={{ fontSize: "0.6rem" }}
                            >
                                {f}
                            </span>
                        ))}
                        {features.length > 4 && (
                            <span
                                className="border border-secondary-subtle rounded px-1 py-0 text-muted"
                                style={{ fontSize: "0.6rem" }}
                            >
                                +{features.length - 4} khác
                            </span>
                        )}
                    </div>
                </div>
            </Link> {/* Kết thúc Link ở đây */}
            
            {/* Vùng tương tác cuối thẻ (không bọc Link) */}
            <div className="d-flex justify-content-between gap-2 p-3 pt-2 border-top">
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={imageHost}
                        alt={`Avatar of ${hostName}`}
                        className="rounded-circle"
                        width="20"
                        height="20"
                        style={{ objectFit: "cover" }}
                        loading="lazy"
                    />
                    <span className="fs-8 text-secondary truncate-text">{hostName}</span>
                </div>
            </div>
        </article>
    );
}

export default HouseCard;
