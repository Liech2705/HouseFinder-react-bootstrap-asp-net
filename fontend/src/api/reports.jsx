import { api } from './api.jsx';

const fetchReport = async () => {
    try {
        const response = await api.get('/Reports');
        return response.data;
    }
    catch (error) {
        console.error("Lỗi khi gọi API Report Count:", error.message);
        throw error;
    }
};

export { fetchReport };