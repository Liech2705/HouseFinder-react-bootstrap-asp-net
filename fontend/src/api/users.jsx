import axios from 'axios'; // Đảm bảo bạn đã import axios
// const API_BASE_URL = '...'; // Khai báo hoặc import API_BASE_URL nếu nó không có trong file này
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};
// 1. Export hàm usersFetch
const usersFetch = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Users`, { headers });
        // Dữ liệu API trả về là mảng các nhà trọ, mỗi nhà trọ có mảng rooms bên trong.
        // Bạn cần xử lý dữ liệu này ở component gọi hàm (ví dụ: gộp tất cả phòng lại thành một mảng phẳng).
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
        throw error;
    }
}

const lockUser = async (userId, data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/Users/locked/${userId}`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
        throw error;
    }
}

const unlockUser = async (userId, reasonLock) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/Users/unlock/${userId}`, { "reason": reasonLock || "" }, { headers });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
        throw error;
    }
}

export { usersFetch, lockUser, unlockUser };