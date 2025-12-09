import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { BsRobot } from 'react-icons/bs';

// Hàm format tiền tệ
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

function SearchSection() {
    const navigate = useNavigate();

    // State tìm kiếm
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]); // Danh sách gợi ý
    const [showSuggestions, setShowSuggestions] = useState(false); // Ẩn/hiện gợi ý

    // Dùng useRef để xử lý click ra ngoài thì đóng dropdown
    const wrapperRef = useRef(null);

    // 1. Xử lý Debounce: Gọi API khi người dùng ngừng gõ 500ms
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (keyword.trim().length > 1) { // Chỉ tìm khi gõ trên 1 ký tự
                try {
                    // Gọi API (Backend đã thêm .Take(5))
                    const response = await api.get(`/BoardingHouse/search?keyword=${keyword}`);
                    setSuggestions(response.data);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Lỗi gợi ý:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500); // Delay 500ms

        return () => clearTimeout(timer); // Xóa timer nếu người dùng gõ tiếp
    }, [keyword]);

    // 2. Ẩn dropdown khi click ra ngoài vùng tìm kiếm
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // 3. Khi click vào một dòng gợi ý
    const handleSelectSuggestion = (houseId) => {
        // Chuyển hướng sang trang chi tiết nhà trọ đó
        navigate(`/houses/${houseId}`);
        setShowSuggestions(false);
    };

    // 4. Khi nhấn nút "Tìm kiếm" (Submit form) -> Sang trang danh sách
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        navigate(`/houses?query=${keyword}`);
    };

    return (
        <section className="bg-search bg-[#f0f8f9] p-4 mx-auto w-100">
            <div className="container">
                <h1 className="text-center fw-semibold fs-4 mb-1 text-dark">
                    Tìm phòng trọ lý tưởng của bạn
                </h1>
                <p className="text-center text-secondary fs-7 mb-4">
                    Hàng nghìn phòng trọ chất lượng, giá cả phải chăng tại Hà Nội
                </p>

                <div className="d-flex justify-content-center">
                    {/* Wrapper này dùng để định vị dropdown tương đối với nó */}
                    <form
                        ref={wrapperRef}
                        className="d-flex flex-column flex-md-row align-items-center gap-2 justify-content-center position-relative"
                        style={{ maxWidth: '600px', width: '100%' }}
                        onSubmit={handleSubmit}
                    >
                        {/* Input Search */}
                        <div className="flex-grow-1 position-relative w-100">
                            <input
                                type="text"
                                style={{ maxWidth: '600px' }}
                                className="form-control form-control-lg shadow-sm"
                                placeholder="Nhập tên đường, khu vực..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                autoComplete="off"
                            />


                            {/* --- PHẦN DROPDOWN GỢI Ý --- */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="card position-absolute w-100 shadow mt-1" style={{ zIndex: 1000, top: '100%', left: 0 }}>
                                    <ul className="list-group list-group-flush text-start">
                                        {suggestions.map((house) => (
                                            <li
                                                key={house.id}
                                                className="list-group-item list-group-item-action cursor-pointer p-2"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleSelectSuggestion(house.id)}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>{house.name}</strong>
                                                        <div className="small text-muted">{house.address}</div>
                                                    </div>
                                                    <div className="text-end">
                                                        <div className="text-primary fw-bold small">{formatCurrency(house.minPrice)}</div>
                                                        <div className="badge bg-light text-dark border">{house.availableRoomsCount} phòng trống</div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        {/* Dòng cuối cùng: Xem tất cả kết quả */}
                                        <li
                                            className="list-group-item list-group-item-action text-center text-primary small bg-light"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleSubmit}
                                        >
                                            Xem tất cả kết quả cho "{keyword}"
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-dark btn-sm fw-semibold">
                            Tìm kiếm
                        </button>
                        <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center"
                            type="button"
                            title="Tìm kiếm bằng AI"
                            // Thay đổi đường dẫn này tới trang chat AI của bạn
                            onClick={() => navigate('/ai-chat-assistant')}
                        >
                            <BsRobot size={24} />
                            <span className="d-none d-md-inline ms-2 small fw-semibold">AI Search</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default SearchSection;