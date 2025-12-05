import { api } from './api.jsx';
import axios from 'axios'; // Đảm bảo bạn đã import axios
// const API_BASE_URL = '...'; // Khai báo hoặc import API_BASE_URL nếu nó không có trong file này
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const headers = {
    "Content-Type": "multipart/form-data",
    'Authorization': `Bearer ${token}`
};

const getUserProfile = async (userId) => {
    try {
        const response = await api.get(`/UserInfor/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
        throw error;
    }
};

const updateUserProfile = async (userId, data) => {
    try {
        const response = await api.put(`/UserInfor/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
        throw error;
    }
};

const uploadAvatar = async (id, file) => {
    try {
        let response = await axios.put(`${API_BASE_URL}/UserInfor/${id}`, file, { headers });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi upload ảnh đại diện:", error.message);
        throw error;
    }
};


export { getUserProfile, updateUserProfile, uploadAvatar };