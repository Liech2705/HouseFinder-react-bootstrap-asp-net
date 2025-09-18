import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../../api/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: 0, // tenant or landlord
        agreeTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'userType' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (!formData.agreeTerms) {
            alert('Vui lòng đồng ý với điều khoản sử dụng!');
            return;
        }

        setIsLoading(true);

        try {
            const { firstName, lastName, email, phone, password, userType } = formData;
            const response = await register({firstName, lastName, email, phone, password, userType: Number(userType)});
            console.log(response);
            alert(response.message);
            window.location.href = '/';
        } catch (error) {
            console.error('Register error:', error);
            const msg = err?.response?.data || 'Có lỗi xảy ra khi đăng ký';
            alert('Đăng ký thất bại. Vui lòng kiểm tra thông tin.' + msg);
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        window.location.href = 'https://localhost:7167/api/Auth/login-google';
    };
    const handleFacebookRegister = () => {
        window.location.href = 'https://localhost:7167/api/Auth/login-facebook';
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center register-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-14 col-lg-12 col-md-9 mt-3 mb-3">
                        <div className="card register-card">
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    {/* Left side - Branding */}
                                    <div className="col-lg-4 register-left">
                                        <div className="register-branding">
                                            <div className="brand-logo">
                                                <img
                                                    src="/assets/logo/logo.png"
                                                    alt="HouseFinder Logo"
                                                    className="logo-img"
                                                />
                                                <h1 className="brand-title text-light">HouseFinder</h1>
                                            </div>
                                            <div className="brand-content ">
                                                <h2 className="welcome-title text-light">Tham gia cùng chúng tôi!</h2>
                                                <p className="welcome-subtitle text-light">
                                                    Tạo tài khoản để bắt đầu hành trình tìm kiếm ngôi nhà hoàn hảo hoặc cho thuê phòng trọ
                                                </p>
                                                <div className="features-list">
                                                    <div className="feature-item">
                                                        <i className="bi bi-check-circle-fill"></i>
                                                        <span>Miễn phí đăng ký</span>
                                                    </div>
                                                    <div className="feature-item">
                                                        <i className="bi bi-check-circle-fill"></i>
                                                        <span>Bảo mật thông tin</span>
                                                    </div>
                                                    <div className="feature-item">
                                                        <i className="bi bi-check-circle-fill"></i>
                                                        <span>Hỗ trợ 24/7</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side - Form */}
                                    <div className="col-lg-8 register-right">
                                        <div className="register-form-container">
                                            <div className="form-header">
                                                <h3 className="form-title">Tạo tài khoản</h3>
                                                <p className="form-subtitle">Điền thông tin để bắt đầu</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="register-form">
                                                {/* User Type Selection */}
                                                <div className="form-group">
                                                    <label className="form-label">Bạn là ai?</label>
                                                    <div className="user-type-selection">
                                                        <div className="user-type-option">
                                                            <input
                                                                type="radio"
                                                                name="userType"
                                                                id="user"
                                                                value={0}
                                                                checked={formData.userType === 0}
                                                                onChange={handleChange}
                                                                className="user-type-input"
                                                            />
                                                            <label htmlFor="user" className="user-type-label">
                                                                <i className="bi bi-house-door"></i>
                                                                <div className="user-type-content">
                                                                    <strong>Người thuê</strong>
                                                                    <small>Tìm phòng trọ</small>
                                                                </div>
                                                            </label>
                                                        </div>
                                                        <div className="user-type-option">
                                                            <input
                                                                type="radio"
                                                                name="userType"
                                                                id="host"
                                                                value={1}
                                                                checked={formData.userType === 1}
                                                                onChange={handleChange}
                                                                className="user-type-input"
                                                            />
                                                            <label htmlFor="host" className="user-type-label">
                                                                <i className="bi bi-key"></i>
                                                                <div className="user-type-content">
                                                                    <strong>Chủ nhà</strong>
                                                                    <small>Cho thuê phòng</small>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Name Fields */}
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label htmlFor="firstName" className="form-label">Họ</label>
                                                        <div className="input-wrapper">
                                                            <i className="bi bi-person input-icon"></i>
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                id="firstName"
                                                                name="firstName"
                                                                value={formData.firstName}
                                                                onChange={handleChange}
                                                                placeholder="Nhập họ của bạn"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="lastName" className="form-label">Tên</label>
                                                        <div className="input-wrapper">
                                                            <i className="bi bi-person input-icon"></i>
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                id="lastName"
                                                                name="lastName"
                                                                value={formData.lastName}
                                                                onChange={handleChange}
                                                                placeholder="Nhập tên của bạn"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Email Field */}
                                                <div className="form-group">
                                                    <label htmlFor="email" className="form-label">Email</label>
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

                                                {/* Phone Field */}
                                                <div className="form-group">
                                                    <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                                    <div className="input-wrapper">
                                                        <i className="bi bi-phone input-icon"></i>
                                                        <input
                                                            type="tel"
                                                            className="form-input"
                                                            id="phone"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            placeholder="Nhập số điện thoại"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Password Fields */}
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                                                        <div className="input-wrapper">
                                                            <i className="bi bi-lock input-icon"></i>
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                className="form-input"
                                                                id="password"
                                                                name="password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                placeholder="Tạo mật khẩu"
                                                                required
                                                                minLength="6"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="password-toggle"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                            </button>
                                                        </div>
                                                        <div className="form-help">Ít nhất 6 ký tự</div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                                                        <div className="input-wrapper">
                                                            <i className="bi bi-lock-fill input-icon"></i>
                                                            <input
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                className="form-input"
                                                                id="confirmPassword"
                                                                name="confirmPassword"
                                                                value={formData.confirmPassword}
                                                                onChange={handleChange}
                                                                placeholder="Nhập lại mật khẩu"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                className="password-toggle"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            >
                                                                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Terms Agreement */}
                                                <div className="form-group">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="agreeTerms"
                                                            name="agreeTerms"
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                        <label className="form-check-label ms-2" htmlFor="agreeTerms">
                                                            Tôi đồng ý với <Link to="/terms" className="terms-link">Điều khoản sử dụng</Link> và <Link to="/privacy" className="terms-link">Chính sách bảo mật</Link>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    className="register-btn"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <span className="spinner"></span>
                                                            Đang tạo tài khoản...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-person-plus"></i>
                                                            Tạo tài khoản
                                                        </>
                                                    )}
                                                </button>

                                                {/* Divider */}
                                                <div className="divider">
                                                    <span>hoặc</span>
                                                </div>

                                                {/* Social Register Buttons */}
                                                <div className="social-login">
                                                    <button type="button" className="social-btn google-btn" onClick={handleGoogleRegister}>
                                                        <i className="bi bi-google"></i>
                                                        <span>Google</span>
                                                    </button>
                                                    <button type="button" className="social-btn facebook-btn" onClick={handleFacebookRegister}>
                                                        <i className="bi bi-facebook"></i>
                                                        <span>Facebook</span>
                                                    </button>
                                                </div>

                                                {/* Login Link */}
                                                <div className="login-link">
                                                    <span>Đã có tài khoản? </span>
                                                    <Link to="/login">Đăng nhập ngay</Link>
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

export default Register;