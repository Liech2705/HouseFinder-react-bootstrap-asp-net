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

const createReport = async (reportData) => {
    try {
        const response = await api.post('/Reports', reportData);
        return response.data;
    } catch (error) {
        console.error("Error creating report:", error.message);
        throw error;
    }
};

export { fetchReport, createReport };