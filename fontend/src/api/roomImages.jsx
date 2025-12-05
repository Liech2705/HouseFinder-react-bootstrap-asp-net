import axios from 'axios'; // Đảm bảo bạn đã import axios
// const API_BASE_URL = '...'; // Khai báo hoặc import API_BASE_URL nếu nó không có trong file này
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

const deleteRoomImage = async (imageId) => {
    try {
        await axios.delete(`${API_BASE_URL}/RoomImages/${imageId}`, { headers });
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi xóa hình ảnh phòng. Vui lòng thử lại.' + error.message);
    }
};

export { deleteRoomImage };