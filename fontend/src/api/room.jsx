import { api } from './api.jsx';

const fetchRoomCount = async () => {
    try {
        const response = await api.get('/Rooms');
        return response.data.length;
    }
    catch (error) {
        console.error("Lỗi khi gọi API Room Count:", error.message);
        throw error;
    }
};
// 1. Export hàm rooms
const fetchRoomsByHouseId = async (houseid) => { // ✅ Dùng export const
    try {
        const response = await api.get(`/Rooms/house/${houseid}`);
        // Dữ liệu API trả về là mảng các nhà trọ, mỗi nhà trọ có mảng rooms bên trong.
        // Bạn cần xử lý dữ liệu này ở component gọi hàm (ví dụ: gộp tất cả phòng lại thành một mảng phẳng).
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API Rooms:", error.message);
        throw error;
    }
};

const fetchRoomsById = async (roomId) => {
    try {
        const response = await api.get(`/Rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API Room by ID:", error.message);
        throw error;
    }
};

const checkBooking = async (roomId) => {
    try {
        const response = await api.get(`/Bookings/CheckRoom/${roomId}`);
        return response.data; // Giả sử API trả về true/false
    } catch (error) {
        console.error("Lỗi khi gọi API CheckBooking:", error.message);
        throw error;
    }
}

const deleteRoom = async (roomId) => {
    try {
        await api.delete(`/Rooms/${roomId}`);
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.' + error.message);
    }
};

// ❌ KHÔNG CẦN DÒNG export default NÀY NỮA
export { fetchRoomsByHouseId, checkBooking, deleteRoom, fetchRoomsById, fetchRoomCount };

// Cách import sau khi sửa:
// import { rooms, testimonials } from '../api/data';