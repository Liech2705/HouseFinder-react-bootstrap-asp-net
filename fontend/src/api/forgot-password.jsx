import axios from 'axios';

// In Vite, env vars must be prefixed with VITE_ and accessed via import.meta.env
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;

const sendOtp = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Auth/sendOtp`, { email }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Send OTP error:", error.response?.data || error.message);
        throw error;
    }
};

const resetPassword = async (email, otp, newPassword) => {
    const response = await axios.post(`${API_BASE_URL}/Auth/resetPassword`,
        { email, otp, newPassword });
    return response.data;
};

const verifyOtp = async (email, otp) => {
    const response = await axios.post(`${API_BASE_URL}/Auth/verifyOtp`,
        { email, otp });
    return response.data;
};

export { sendOtp, resetPassword, verifyOtp };