
import { useLocation, useNavigate } from 'react-router-dom';
import HostelMap from './HostelMap'; // Đảm bảo đường dẫn đúng

const MapPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu nhà trọ được truyền từ trang trước
    const house = location.state?.house;

    // Nếu người dùng vào thẳng link này mà không có dữ liệu -> quay về
    if (!house) {
        return (
            <div className="container py-5 text-center">
                <p>Không tìm thấy dữ liệu địa điểm.</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>Quay lại</button>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            {/* Nút quay lại nổi trên bản đồ */}
            <button
                onClick={() => navigate(-1)}
                className="btn btn-light shadow-sm"
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '60px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    fontWeight: 'bold'
                }}
            >
                <i className="bi bi-arrow-left me-2"></i> Quay lại chi tiết
            </button>

            {/* Bản đồ full màn hình */}
            <HostelMap hostels={[house]} />
        </div>
    );
};

export default MapPage;