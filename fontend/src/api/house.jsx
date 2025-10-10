import axios from 'axios';

// In Vite, env vars must be prefixed with VITE_ and accessed via import.meta.env
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;

const house = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/BoardingHouse`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export { house };