import axios from 'axios';

// In Vite, env vars must be prefixed with VITE_ and accessed via import.meta.env
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;


const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};
const house = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/BoardingHouse`, { headers });
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

const hiddenHouse = async (houseId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/BoardingHouse/hide/${houseId}`, {}, { headers });
        return response.data;
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi ẩn nhà trọ. Vui lòng thử lại.' + error.message);
    }
};

const visibleHouse = async (houseId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/BoardingHouse/visible/${houseId}`, {}, { headers });
        return response.data;
    } catch (error) {
        console.error(error.message);
        alert('Đã có lỗi xảy ra khi ẩn nhà trọ. Vui lòng thử lại.' + error.message);
    }
};

const createHouse = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/BoardingHouse`, data, { headers });
    if (!response.ok) throw new Error("Failed to create house");
    return response.json();
};

export { house, hiddenHouse, visibleHouse, createHouse };