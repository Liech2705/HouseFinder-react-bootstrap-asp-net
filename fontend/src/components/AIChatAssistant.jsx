import { useState, useEffect, useRef } from 'react';
import { Send, Robot, Person } from 'react-bootstrap-icons'; // Cài: npm install react-bootstrap-icons
import { sendChatRequest, house } from '../api/api.jsx'; // Đường dẫn tới file api ở bước 1
import { Link } from 'react-router-dom';
import axios from 'axios'; // Dùng để fetch data nhà nếu cần

const AIChatAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'system', text: 'Xin chào! Tôi là trợ lý AI tìm nhà trọ. Bạn đang tìm phòng ở khu vực nào, giá khoảng bao nhiêu?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendedHouses, setRecommendedHouses] = useState([]);

    // Ref để tự cuộn xuống tin nhắn mới nhất
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Hàm xử lý gửi tin nhắn
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');

        // 1. Thêm tin nhắn user vào list
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // 2. Gọi API Backend
            const data = await sendChatRequest(userMessage);

            // data bao gồm: { reply: "...", houseIds: [1, 2, 3] }

            // 3. Thêm phản hồi của AI vào list
            setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);

            // 4. Xử lý danh sách HouseIds trả về
            if (data.houseIds && data.houseIds.length > 0) {
                console.log("Tìm thấy các ID:", data.houseIds);
                fetchRecommendedHouses(data.houseIds);
            }

        } catch (error) {
            setMessages(prev => [...prev, { role: 'system', text: 'Xin lỗi, hệ thống đang gặp sự cố kết nối.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm lấy thông tin chi tiết nhà từ ID (Logic tùy thuộc vào project của bạn)
    const fetchRecommendedHouses = async (ids) => {
        try {
            // CÁCH 1: Nếu Backend có API get-by-ids
            // const res = await axios.post('https://localhost:7167/api/houses/get-by-ids', ids);
            // setRecommendedHouses(res.data);

            // CÁCH 2 (Tạm thời): Fetch tất cả rồi filter (Không tối ưu nếu data lớn, nhưng dễ test)
            const res = await house(); // API lấy all house cũ của bạn
            const allHouses = res;
            const filtered = allHouses.filter(h => ids.includes(h.house_Id));
            setRecommendedHouses(filtered);

        } catch (err) {
            console.error("Lỗi lấy thông tin nhà:", err);
        }
    };

    // Xử lý phím Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };
    console.log(recommendedHouses);
    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="row">

                {/* CỘT TRÁI: KHUNG CHAT */}
                <div className="col-md-4 col-lg-3 d-flex flex-column" style={{ height: '85vh' }}>
                    <div className="card border-0 shadow-sm flex-grow-1 overflow-hidden">
                        <div className="card-header bg-primary text-white d-flex align-items-center">
                            <Robot className="me-2" />
                            <h6 className="mb-0">Trợ lý AI HouseFinder</h6>
                        </div>

                        {/* List tin nhắn */}
                        <div className="card-body overflow-auto" style={{ backgroundColor: '#fff' }}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    {msg.role === 'bot' && <div className="me-2"><Robot size={24} className="text-primary" /></div>}

                                    <div className={`p-3 rounded-3 shadow-sm ${msg.role === 'user'
                                        ? 'bg-primary text-white'
                                        : msg.role === 'system' ? 'bg-warning bg-opacity-25 text-dark' : 'bg-light text-dark border'
                                        }`} style={{ maxWidth: '85%', whiteSpace: 'pre-line' }}>
                                        {msg.text}
                                    </div>

                                    {msg.role === 'user' && <div className="ms-2"><Person size={24} className="text-secondary" /></div>}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="d-flex justify-content-start mb-3">
                                    <div className="bg-light p-3 rounded-3 text-secondary fst-italic">
                                        Đang suy nghĩ...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input chat */}
                        <div className="card-footer bg-white border-top p-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm nhà trọ ở quận Ninh Kiều giá dưới 3 triệu..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={isLoading}
                                />
                                <button className="btn btn-primary" onClick={handleSend} disabled={isLoading}>
                                    <Send />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: KẾT QUẢ GỢI Ý */}
                <div className="col-md-8 col-lg-9">
                    <h4 className="mb-4 text-primary fw-bold">🏠 Đề xuất cho bạn</h4>

                    {recommendedHouses.length === 0 ? (
                        <div className="text-center text-muted mt-5">
                            <img src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-6275834-5210416.png" alt="Empty" style={{ width: '200px', opacity: 0.6 }} />
                            <p>Hãy hỏi tôi để tìm kiếm nhà trọ phù hợp nhé!</p>
                        </div>
                    ) : (
                        <div className="row g-2">
                            {recommendedHouses.map(house => {
                                const placeholder = 'https://surl.li/drynzt';
                                // Logic lấy ảnh giống component Favorite của bạn
                                const imageUrl = house.houseImages && house.houseImages.length > 0
                                    ? import.meta.env.VITE_URL_ROOT + house.houseImages[0].image_Url
                                    : placeholder;

                                return (
                                    <div key={house.house_Id} className="col-12 col-md-6 col-xl-4">
                                        <div className="card h-100 shadow-sm border-0 hover-shadow transition">
                                            <div className="position-relative">
                                                <img
                                                    src={imageUrl}
                                                    className="card-img-top"
                                                    alt={house.house_Name}
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = placeholder }}
                                                />
                                                <span className="position-absolute top-0 end-0 m-2 badge bg-success">
                                                    Gợi ý phù hợp
                                                </span>
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold text-truncate">{house.house_Name}</h5>
                                                <p className="card-text text-secondary small">
                                                    📍 {house.street}, {house.commune}
                                                </p>
                                                <p className="card-text text-truncate small text-muted">
                                                    {house.description}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <Link to={`/houses/${house.house_Id}`} className="btn btn-sm btn-outline-primary rounded-pill">
                                                        Xem chi tiết
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIChatAssistant;