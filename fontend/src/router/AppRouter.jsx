// filepath: src/router/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AuthCallback from '../api/authCallback';
import SocialComplete from '../api/SocialComplete.jsx';
import HouseDetail from '../pages/user/Houses/HouseDetail.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import HostelManager from '../pages/admin/HostelManager.jsx';
import HouseList from '../pages/user/Houses/HouseList.jsx';
import RoomDetail from '../pages/user/Rooms/RoomDetail.jsx';


const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Routes wrapped with header/footer */}
                <Route path="/" element={<MainLayout><App /></MainLayout>} />
                <Route path="/houses" element={<MainLayout><HouseList /></MainLayout>} />
                <Route path="/houses/:id" element={<MainLayout><HouseDetail /></MainLayout>} />
                <Route path="/houses/:houseId/rooms/:roomId" element={<MainLayout><RoomDetail /></MainLayout>} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="rooms" element={<HostelManager />} />
                    {/* Các route con khác */}
                </Route>

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