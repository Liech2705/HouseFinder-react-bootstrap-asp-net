import { api } from './api.jsx';
// In Vite, env vars must be prefixed with VITE_ and accessed via import.meta.env

const house = async () => {
    try {
        const response = await api.get(`/BoardingHouse`);
        // console.log("Fetched houses:", response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

const fetchHouseById = async (houseId) => {
    try {
        const response = await api.get(`/BoardingHouse/${houseId}`);
        return response.data;
    }
    catch (error) {
        console.error("Lỗi khi gọi API BoardingHouse by ID:", error.message);
        throw error;
    }
};

const hiddenHouse = async (houseId) => {
    try {
        const response = await api.put(`/BoardingHouse/hide/${houseId}`, {});
        return response.data;
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi ẩn nhà trọ. Vui lòng thử lại.' + error.message);
    }
};

const visibleHouse = async (houseId) => {
    try {
        const response = await api.put(`/BoardingHouse/visible/${houseId}`, {});
        return response.data;
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi hiển thị nhà trọ. Vui lòng thử lại.' + error.message);
    }
};

const createHouse = async (data) => {
    try {
        const response = await api.post(`/BoardingHouse`, data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi thêm nhà trọ. Vui lòng thử lại.' + error.message);
    }
};

const updateHouse = async (houseId, data) => {
    try {
        const response = await api.put(`/BoardingHouse/${houseId}`, data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi cập nhật nhà trọ. Vui lòng thử lại.' + error.message);
    }
};

const deleteHouse = async (houseId) => {
    try {
        await api.delete(`/BoardingHouse/${houseId}`);
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi xóa nhà trọ. Vui lòng thử lại.' + error.message);
    }
};

export { house, fetchHouseById, hiddenHouse, visibleHouse, createHouse, updateHouse, deleteHouse };