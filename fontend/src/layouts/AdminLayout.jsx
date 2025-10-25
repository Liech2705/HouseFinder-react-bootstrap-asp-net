import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";

const menu = [
    { label: "Tổng quan", icon: "bi bi-speedometer2", to: "/admin" },
    { label: "Nhà trọ", icon: "bi bi-house-door", to: "/admin/rooms" },
    { label: "Vi phạm", icon: "bi bi-file-earmark-text", to: "/admin/reports" },
    { label: "Tài khoản", icon: "bi bi-person", to: "/admin/accounts" },

];

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [authorized, setAuthorized] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || user.role !== 2) {
                setAuthorized(false);
                navigate("/");
            } else {
                setAuthorized(true);
            }
        } catch (error) {
            setAuthorized(false);
            navigate("/");
        }
    }, [navigate]);

    if (authorized === null) {
        return <div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" /></div>;
    }
    if (authorized === false) {
        return null;
    }

    return (
        <>
            <Header />
            <div className="d-flex bg-light" style={{ minHeight: "100vh", overflow: "hidden" }}>
                {/* Sidebar */}
                <nav
                    className={`dashboard-sidebar bg-white border-end shadow-sm ${collapsed ? "collapsed" : ""}`}
                    style={{
                        width: collapsed ? 64 : 220,
                        transition: "width .2s",
                        height: "100vh",
                        position: "fixed",
                        top: 'calc(var(--header-height, 64px) + 1rem)',
                        left: 0,
                        overflowY: "auto",
                        zIndex: 1040,
                    }}
                >
                    <div className="d-flex flex-column h-100">
                        <div className="sidebar-header d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
                            <span className="fw-bold text-primary" style={{ fontSize: "1.2rem" }}>
                                <i className={collapsed ? "" : "bi bi-house-door me-2"}></i>
                                {!collapsed && "Quản trị"}
                            </span>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setCollapsed((c) => !c)}
                                title={collapsed ? "Mở rộng" : "Thu gọn"}
                                style={{ width: 32, height: 32, padding: 0 }}
                            >
                                <i className={`bi ${collapsed ? "bi bi-chevron-right" : "bi bi-chevron-left"}`}></i>
                            </button>
                        </div>

                        <ul className="nav flex-column pt-2">
                            {menu.map((item) => (
                                <li key={item.to} className="nav-item">
                                    <Link
                                        to={item.to}
                                        className={`nav-link d-flex align-items-center px-3 py-2${location.pathname === item.to ? " active" : ""}`}
                                        style={{
                                            gap: "0.75rem",
                                            fontSize: "1rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <i className={item.icon}></i>
                                        {!collapsed && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Main content */}
                <main
                    className="flex-grow-1 p-4"
                    style={{
                        marginLeft: collapsed ? 64 : 220,
                        transition: "margin-left .2s",
                        width: "100%",
                    }}
                >
                    <Outlet />
                </main>

                {/* Sidebar CSS */}
                <style>{`
                .dashboard-sidebar {
                    scrollbar-width: thin;
                    scrollbar-color: #ccc #f8f9fa;
                    }
                    .dashboard-sidebar::-webkit-scrollbar {
                    width: 6px;
                    }
                    .dashboard-sidebar::-webkit-scrollbar-thumb {
                    background-color: #ccc;
                    border-radius: 10px;
                    }
                    .dashboard-sidebar.collapsed .nav-link {
                    justify-content: center;
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                    }
                    .dashboard-sidebar.collapsed .sidebar-header {
                    justify-content: center;
                    }
                    .nav-link.active {
                    background: #0d6efd;
                    color: #fff !important;
                    border-radius: 0.5rem;
                    }
                `}</style>
            </div>

        </>
    );
}