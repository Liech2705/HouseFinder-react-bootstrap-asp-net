// filepath: src/router/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AuthCallback from '../api/authCallback';
import SocialComplete from '../api/SocialComplete.jsx';
import RoomsList from '../pages/user/RoomsList.jsx';
import RoomDetail from '../pages/user/RoomDetail.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Routes wrapped with header/footer */}
                <Route path="/" element={<MainLayout><App /></MainLayout>} />
                <Route path="/rooms" element={<MainLayout><RoomsList /></MainLayout>} />
                <Route path="/rooms/:id" element={<MainLayout><RoomDetail /></MainLayout>} />

                {/* Auth pages without header/footer */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<SocialComplete />} />
                <Route path="/auth-re/callback" element={<AuthCallback />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;