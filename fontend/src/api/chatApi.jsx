import axios from 'axios';

// Đổi URL này theo port backend của bạn
const API_BASE_URL = 'https://localhost:7167';

export const sendChatRequest = async (message) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/OpenAI/assist`, {
            message: message,
            topK: 3,       // Có thể tùy chỉnh
            minScore: 0.2  // Có thể tùy chỉnh
        });
        return response.data; // Trả về { reply, houseIds }
    } catch (error) {
        console.error("Lỗi khi gọi API chat:", error);
        throw error;
    }
};

// Hàm lấy chi tiết nhà trọ theo danh sách ID (Bạn cần tự viết API backend tương ứng hoặc lọc từ list có sẵn)
export const fetchHousesByIds = async (ids) => {
    if (!ids || ids.length === 0) return [];
    // Ví dụ: gọi API lấy danh sách nhà theo ID
    // const response = await axios.post(`${API_BASE_URL}/api/houses/by-ids`, { ids });
    // return response.data;

    // HOẶC: Nếu bạn chưa có API lấy theo ID, bạn có thể truyền list tất cả nhà vào component và dùng hàm filter (xem bên dưới).
    return [];
};