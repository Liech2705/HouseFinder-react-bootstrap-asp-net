import axios from 'axios'; // Đảm bảo bạn đã import axios
// const API_BASE_URL = '...'; // Khai báo hoặc import API_BASE_URL nếu nó không có trong file này
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
};
// 1. Export hàm rooms
const getFavorite = async (userId, houseId) => { // ✅ Dùng export const
    try {
        const response = await axios.get(`${API_BASE_URL}/FavoriteHouse/${houseId}/${userId}`, {headers});
        // Dữ liệu API trả về là mảng các nhà trọ, mỗi nhà trọ có mảng rooms bên trong.
        // Bạn cần xử lý dữ liệu này ở component gọi hàm (ví dụ: gộp tất cả phòng lại thành một mảng phẳng).
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API BoardingHouse:", error.message);
        throw error;
    }
};

const postFavorite = async (userId, houseId) => { 
    try {
        const response = await axios.post(`${API_BASE_URL}/FavoriteHouse/${houseId}`, userId, {headers});
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API BoardingHouse:", error.message);
        throw error;
    }
};

export { getFavorite, postFavorite };