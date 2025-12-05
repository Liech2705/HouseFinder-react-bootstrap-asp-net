import { api } from "./api";


const login = async ({ email, password }) => {
    const response = await api.post(`/Auth/login`, { email, password });
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
    const response = await api.post(`/Auth/register`, payload);

    console.log('Register response:', response);
    return response.data;
};

const logout = async () => {
    try {
        await api.post(`/Auth/logout`, null);
        console.log("Server logout successful.");
    } catch (error) {
        console.error("Logout API error:", error.response?.data || error.message);
    } finally {
        // Always clear local session information
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log("Local session cleared.");
    }
}

export { login, register, logout };