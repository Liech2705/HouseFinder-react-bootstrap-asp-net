import axios from 'axios'; // Đảm bảo bạn đã import axios
// const API_BASE_URL = '...'; // Khai báo hoặc import API_BASE_URL nếu nó không có trong file này
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;
// 1. Export hàm rooms
export const rooms = async () => { // ✅ Dùng export const
    try {
        const response = await axios.get(`${API_BASE_URL}/BoardingHouse`, {
            headers: { 'Content-Type': 'application/json' }
        });
        // Dữ liệu API trả về là mảng các nhà trọ, mỗi nhà trọ có mảng rooms bên trong.
        // Bạn cần xử lý dữ liệu này ở component gọi hàm (ví dụ: gộp tất cả phòng lại thành một mảng phẳng).
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API BoardingHouse:", error.message);
        throw error;
    }
};

// ❌ KHÔNG CẦN DÒNG export default NÀY NỮA
// export default rooms;

// Cách import sau khi sửa:
// import { rooms, testimonials } from '../api/data';