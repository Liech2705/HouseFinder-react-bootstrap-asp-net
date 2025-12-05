import { testimonials } from './Testimonials.jsx';
export * from './room.jsx';
import { login } from './auth.jsx';
export { login, testimonials };
export * from './forgot-password.jsx';
export * from './house.jsx';
export * from './users.jsx';
export * from './UserFavorite.jsx';
export * from './userProfile.jsx';
export * from './chatrealtime.jsx';
export * from './roomImages.jsx';
export * from './reports.jsx';
export * from './bookings.jsx';
export * from './reviews.jsx'

// api.js
import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_URL_API_ROOT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
