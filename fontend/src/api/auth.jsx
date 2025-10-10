import axios from 'axios';

// In Vite, env vars must be prefixed with VITE_ and accessed via import.meta.env
const API_BASE_URL = import.meta.env.VITE_URL_API_ROOT;

const login = async ({ email, password }) => {
    const response = await axios.post(`${API_BASE_URL}/Auth/login`, { email, password }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    return response.data;
};

const register = async ({ firstName, lastName, email, phone, password, userType }) => {
    // Ensure backend receives DTO directly, not wrapped in { data: ... }
    // Convert role to enum-compatible number if a string is provided
    let roleValue = userType;
    if (typeof userType === 'string') {
        const map = {
            user: 0,
            host: 1,
            admin: 2,
        };
        roleValue = map[userType.trim().toLowerCase()] ?? 0;
    }

    const payload = {
        userName: `${firstName} ${lastName}`.trim(),
        email,
        password,
        phone,
        role: roleValue,
    };
    const response = await axios.post(`${API_BASE_URL}/Auth/register`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    console.log('Register response:', response);
    return response.data;
};

const logout = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Logging out with token:', token);
    if (!token) return;
    try {
        await axios.post(`${API_BASE_URL}/Auth/logout`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
    } catch (error) {
        console.error("Logout error:", error.response?.data || error.message);
    }

}

export { login, register, logout };