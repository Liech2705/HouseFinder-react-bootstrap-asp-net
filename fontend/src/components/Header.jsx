import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { logout } from '../api/auth.jsx';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in (you can replace this with your actual auth logic)
        const checkAuth = () => {
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (userData && token) {
                setUser(JSON.parse(userData));
                setIsLoggedIn(true);
            }
        };
        checkAuth();
    }, []);


    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }

        // Clear local state and redirect regardless of API success
        setIsLoggedIn(false);
        setUser(null);
        navigate('/');
        window.location.reload(); // Force a refresh to clear all state
    };

    return (
        <header className="bg-white border-bottom header-full-width">
            <nav className="container d-flex justify-content-between align-items-center py-3">
                <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
                    <img
                        src="/assets/logo/logo.png"
                        alt="RoomFinder logo"
                        width="40"
                        height="40"
                    />
                    <span className="fw-semibold fs-6 text-dark">RoomFinder</span>
                </Link>

                <ul className="nav d-none d-md-flex fs-7">
                    <li className="nav-item">
                        <Link className="nav-link px-2 text-dark" to="/">
                            Trang chủ
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link px-2 text-dark" to="/houses">
                            Tìm phòng
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link px-2 text-dark" href="#">
                            Đăng tin
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link px-2 text-dark" href="#">
                            Liên hệ
                        </a>
                    </li>
                </ul>

                <div className="d-flex gap-2 align-items-center">
                    {isLoggedIn ? (
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-2"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                    src={`${import.meta.env.VITE_URL_ROOT}${user?.avatar}`}
                                    alt="Avatar"
                                    className="rounded-circle"
                                    style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                />
                                <span className="d-none d-md-inline">{user?.userName || 'User'}</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <h6 className="dropdown-header">
                                        <i className="bi bi-person me-2"></i>
                                        {user?.userName}
                                    </h6>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link className="dropdown-item" to="/profile">
                                        <i className="bi bi-person me-2"></i>
                                        Thông tin cá nhân
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/my-bookings">
                                        <i className="bi bi-house me-2"></i>
                                        Phòng đã đặt
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/favorite">
                                        <i className="bi bi-heart me-2"></i>
                                        Yêu thích
                                    </Link>
                                </li>
                                {user?.role == "Admin" ? (
                                    <li>
                                        <Link className="dropdown-item" to="/admin">
                                            <i className="bi bi-gear me-2"></i>
                                            Quản Trị
                                        </Link>
                                    </li>
                                ) : null
                                }
                                {user?.role == "Host" ? (
                                    <li>    
                                        <Link className="dropdown-item" to="/manage">
                                            <i className="bi bi-gear me-2"></i>
                                            Quản lý phòng trọ
                                        </Link>
                                    </li>
                                ) : null
                                }
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="btn btn-outline btn-sm d-none d-md-inline-block fs-7 fw-semibold text-decoration-none"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-secondary btn-sm fs-7 fw-semibold text-decoration-none"
                            >
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
