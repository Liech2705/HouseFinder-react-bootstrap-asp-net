import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../api/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { email, password, rememberMe } = formData;
            const response = await login({ email, password });
            const { token, data } = response || {};
            
            if (token) {
                if (rememberMe) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
            }
            
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            alert(response.message);
            // console.log('Login successful:', localStorage.getItem('user'));

            window.location.href = '/';
        } catch (error) {
            console.error('Login error:', error.data);
            alert('Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleGoogleLogin = () => {
        window.location.href = 'https://localhost:7167/api/Auth/login-google';
    };
    const handleFacebookLogin = () => {
        window.location.href = 'https://localhost:7167/api/Auth/login-facebook';
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center login-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card login-card">
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    {/* Left side - Branding */}
                                    <div className="col-lg-6 login-left">
                                        <Link className="login-branding text-decoration-none" to="/">
                                            <div className="brand-logo">
                                                <img
                                                    src="/assets/logo/logo.png"
                                                    alt="HouseFinder Logo"
                                                    className="logo-img"
                                                />
                                                <h1 className="brand-title">HouseFinder</h1>
                                            </div>
                                            <div className="brand-content">
                                                <h2 className="welcome-title">Chào mừng trở lại!</h2>
                                                <p className="welcome-subtitle">
                                                    Đăng nhập để tiếp tục hành trình tìm kiếm ngôi nhà hoàn hảo của bạn
                                                </p>
                                                <div className="features-list">
                                                    <div className="feature-item">
                                                        <i className="bi bi-check-circle-fill"></i>
                                                        <span>Tìm kiếm thông minh</span>
                                                    </div>
                                                    <div className="feature-item">
                                                        <i className="bi bi-check-circle-fill"></i>
                                                        <span>Bản đồ tích hợp</span>
                                                    </div>
                                                    <div className="feature-item">
                                                        <i className="bi bi-check-circle-fill"></i>
                                                        <span>Hỗ trợ 24/7</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Right side - Form */}
                                    <div className="col-lg-6 login-right">
                                        <div className="login-form-container">
                                            <div className="form-header">
                                                <h3 className="form-title">Đăng nhập</h3>
                                                <p className="form-subtitle">Nhập thông tin để tiếp tục</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="login-form">
                                                {/* Email Field */}
                                                <div className="form-group">
                                                    <label htmlFor="email" className="form-label">
                                                        Email
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <i className="bi bi-envelope input-icon"></i>
                                                        <input
                                                            type="email"
                                                            className="form-input"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="Nhập email của bạn"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Password Field */}
                                                <div className="form-group">
                                                    <label htmlFor="password" className="form-label">
                                                        Mật khẩu
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <i className="bi bi-lock input-icon"></i>
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            className="form-input"
                                                            id="password"
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            placeholder="Nhập mật khẩu"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="password-toggle"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Remember Me & Forgot Password */}
                                                <div className="form-options">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="rememberMe"
                                                            name="rememberMe"
                                                            checked={formData.rememberMe}
                                                            onChange={handleChange}
                                                        />
                                                        <label className="form-check-label" htmlFor="rememberMe">
                                                            Ghi nhớ đăng nhập
                                                        </label>
                                                    </div>
                                                    <Link to="/forgot-password" className="forgot-link">
                                                        Quên mật khẩu?
                                                    </Link>
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    className="login-btn"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <span className="spinner"></span>
                                                            Đang đăng nhập...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-box-arrow-in-right"></i>
                                                            Đăng nhập
                                                        </>
                                                    )}
                                                </button>

                                                {/* Divider */}
                                                <div className="divider">
                                                    <span>hoặc</span>
                                                </div>

                                                {/* Social Login Buttons */}
                                                <div className="social-login">
                                                    <button type="button" className="social-btn google-btn" onClick={handleGoogleLogin}>
                                                        <i className="bi bi-google"></i>
                                                        <span>Google</span>
                                                    </button>
                                                    <button type="button" className="social-btn facebook-btn" onClick={handleFacebookLogin}>
                                                        <i className="bi bi-facebook"></i>
                                                        <span>Facebook</span>
                                                    </button>
                                                </div>

                                                {/* Register Link */}
                                                <div className="register-link">
                                                    <span>Chưa có tài khoản? </span>
                                                    <Link to="/register">Đăng ký ngay</Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;