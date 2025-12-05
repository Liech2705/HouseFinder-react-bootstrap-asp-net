import { useEffect, useState, useMemo } from "react";
import HouseCard from "./HouseCard.jsx";
// Giả định rooms API trả về dữ liệu Houses (Đổi tên alias)
import { house as housesData } from "../api/api.jsx";
import { Link } from "react-router-dom";

// Định nghĩa trạng thái hiển thị (Giả định 1 là trạng thái hiển thị công khai)
const VISIBLE_STATUS = "visible";

// ✅ Component hiển thị danh sách Nhà trọ dưới dạng lưới
function HouseGrid({ housesOverride }) {
    // housesData là một function, cần gọi nó. Dùng useState và useEffect để load data.
    const rawList = housesOverride ?? housesData;

    // ✅ Thêm state để lưu trữ dữ liệu sau khi được load (nếu housesData là async function)
    const [list, setList] = useState(Array.isArray(rawList) ? rawList : []);
    const [loading, setLoading] = useState(!Array.isArray(rawList));
    // Logic để fetch data nếu housesData là async function
    useEffect(() => {
        if (!Array.isArray(rawList) && typeof rawList === 'function') {
            rawList()
                .then(data => {
                    setList(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching houses data:", error);
                    setList([]); // Đặt thành mảng rỗng khi lỗi
                    setLoading(false);
                });
        }
    }, [rawList]);


    // ✅ LOGIC ĐÃ SỬA: Lọc chỉ những nhà trọ có status = VISIBLE_STATUS
    const popularHouses = useMemo(() => {
        // 1. Lọc: Chỉ lấy những nhà trọ có status là visible (1)
        let visibleHouses = list.filter(house => house.status == VISIBLE_STATUS);

        // 2. Lọc tiếp: Loại bỏ những nhà trọ không có phòng
        let filtered = visibleHouses.filter(house => house.rooms && house.rooms.length > 0);

        // 3. Sắp xếp: Giả lập "Phổ biến" bằng cách ưu tiên nhà trọ có nhiều phòng trống nhất
        const sorted = filtered.map(house => ({
            ...house,
            // Thêm trường calculatedPopularity: số lượng phòng còn trống
            calculatedPopularity: house.rooms.filter(r => r.status == VISIBLE_STATUS).length
        })).sort((a, b) => b.calculatedPopularity - a.calculatedPopularity); // Sắp xếp giảm dần

        return sorted.slice(0, 5); // Lấy 5 kết quả hàng đầu
    }, [list]); // Dependency list giữ nguyên

    const [visibleCount, setVisibleCount] = useState(5);

    // Responsive: điều chỉnh số lượng card hiển thị theo kích thước (Giữ nguyên)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 576) setVisibleCount(1);
            else if (window.innerWidth < 768) setVisibleCount(2);
            else if (window.innerWidth < 992) setVisibleCount(3);
            else if (window.innerWidth < 1400) setVisibleCount(4);
            else setVisibleCount(5);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (loading) {
        return <div className="text-center my-5 text-muted">Đang tải danh sách nhà trọ...</div>;
    }

    // Kiểm tra nếu danh sách list rỗng ban đầu, hoặc sau khi lọc popularHouses rỗng
    if (list.length === 0 || popularHouses.length === 0) {
        return <div className="text-center my-5 text-muted">Hiện chưa có dữ liệu nhà trọ công khai hoặc không có nhà trọ nào đủ điều kiện phổ biến.</div>;
    }

    return (
        <section className="my-5">
            <div className="container my-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-dark mb-2" style={{ fontSize: "1.8rem" }}>
                        Nhà Trọ Phổ Biến Nhất
                    </h2>
                    <p className="text-muted lead mb-0">
                        Những lựa chọn được yêu thích nhất bởi người thuê!
                    </p>
                </div>

                {/* Hàng ngang cố định */}
                <div
                    className="d-flex justify-content-center align-items-stretch gap-3 flex-nowrap"
                    style={{ width: "100%" }}
                >
                    {/* Chỉ render các nhà trọ phổ biến đã được lọc và sắp xếp */}
                    {popularHouses.slice(0, visibleCount).map((house) => (
                        <div
                            key={house.house_Id}
                            className="room-card-wrapper flex-fill"
                            style={{
                                flex: `0 0 ${100 / visibleCount}%`,
                                maxWidth: `${100 / visibleCount}%`,
                            }}
                        >
                            <div className="room-card-slider h-100">
                                <HouseCard house={house} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút xem thêm */}
                <div className="text-center mt-5">
                    <Link className="btn btn-outline-primary rounded-pill px-5 py-2 fw-semibold shadow-sm hover-glow" to="/houses">
                        Xem tất cả nhà trọ
                    </Link>
                </div>
            </div>

            {/* CSS giữ nguyên */}
            <style>{`
                .room-card-wrapper {
                    transition: transform 0.25s ease;
                }
                .room-card-slider {
                    border-radius: 1.2rem;
                    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
                    background: #fff;
                    transition: all 0.25s ease;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .room-card-slider:hover {
                    transform: translateY(-6px) scale(1.03);
                    box-shadow: 0 10px 30px rgba(13, 110, 253, 0.15);
                }
                .hover-glow:hover {
                    box-shadow: 0 0 15px rgba(13, 110, 253, 0.35);
                    transform: translateY(-3px);
                    transition: all 0.25s ease;
                }

                @media (max-width: 575.98px) {
                    .room-card-wrapper {
                        max-width: 100%;
                    }
                }
            `}</style>
        </section>
    );
}

export default HouseGrid;