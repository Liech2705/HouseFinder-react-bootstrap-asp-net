import { useState, useEffect } from "react"; // Sửa: bỏ React thừa
import { sendOtp, verifyOtp, resetPassword } from "../../api/api.jsx";
import { useNavigate, Link } from "react-router-dom";

const steps = [
    { label: "Nhập Email", icon: "bi-envelope" },
    { label: "Nhập OTP", icon: "bi-shield-lock" },
    { label: "Mật khẩu mới", icon: "bi-key" },
];

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Progress bar component
    const ProgressBar = () => (
        <div className="d-flex justify-content-center align-items-center mb-4">
            {steps.map((s, idx) => (
                <div key={s.label} className="d-flex align-items-center"> {/* Bọc trong div để key hoạt động đúng */}
                    <div className={`step-circle ${step === idx + 1 ? "active" : step > idx + 1 ? "done" : ""}`}>
                        <i className={`bi ${s.icon}`}></i>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className={`step-bar ${step > idx + 1 ? "done" : ""}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    // Step 1: Nhập email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage(""); // Reset message cũ

        // Regex email đơn giản nhưng đủ dùng
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setErrors({ email: "Vui lòng nhập email hợp lệ!" });
            return;
        }

        setLoading(true);
        try {
            await sendOtp(email);
            setStep(2);
            setMessage("Mã OTP đã được gửi về email của bạn. Vui lòng kiểm tra (cả mục Spam).");
        } catch (error) {
            console.error("Lỗi gửi OTP:", error);
            // Hiển thị lỗi từ server nếu có
            const msg = error.response?.data?.message || "Không gửi được OTP. Vui lòng kiểm tra lại email!";
            setErrors({ email: msg });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Nhập OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage("");

        // OTP thường là 6 số, nhưng có thể backend yêu cầu khác, ở đây giữ 6 số
        if (!otp || otp.length !== 6) {
            setErrors({ otp: "Vui lòng nhập mã OTP gồm 6 số!" });
            return;
        }

        setLoading(true);
        try {
            await verifyOtp(email, otp);
            setStep(3);
            setMessage(""); // Xóa thông báo OTP đã gửi để tránh nhầm lẫn
        } catch (error) {
            console.error("Lỗi verify OTP:", error);
            const msg = error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn!";
            setErrors({ otp: msg });
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Đặt mật khẩu mới
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage("");

        if (!newPassword || newPassword.length < 6) {
            setErrors({ newPassword: "Mật khẩu phải có ít nhất 6 ký tự!" });
            return;
        }
        if (newPassword !== confirm) {
            setErrors({ confirm: "Mật khẩu xác nhận không khớp!" });
            return;
        }

        setLoading(true);
        try {
            // Lưu ý: resetPassword API thường cần cả email, otp (hoặc token) và password mới
            // Giả sử API của bạn nhận (email, otp, newPassword)
            await resetPassword(email, otp, newPassword);

            setMessage("Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...");
            // Xóa các state nhạy cảm
            setNewPassword("");
            setConfirm("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Lỗi reset password:", error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại!";
            setErrors({ newPassword: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-5">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-4">
                                <h3 className="mb-3 text-center fw-bold text-primary">Quên mật khẩu</h3>

                                <ProgressBar />

                                {/* Step 1 Form */}
                                {step === 1 && (
                                    <form onSubmit={handleSendOtp}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email đăng ký</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <i className="bi bi-envelope"></i>
                                                </span>
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập email của bạn"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    autoFocus
                                                    disabled={loading}
                                                />
                                            </div>
                                            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Đang gửi...
                                                </>
                                            ) : "Gửi mã OTP"}
                                        </button>
                                    </form>
                                )}

                                {/* Step 2 Form */}
                                {step === 2 && (
                                    <form onSubmit={handleVerifyOtp}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Nhập mã OTP</label>
                                            <div className="text-muted small mb-2">Đã gửi mã đến: <strong>{email}</strong></div>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <i className="bi bi-shield-lock"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập mã OTP gồm 6 số"
                                                    value={otp}
                                                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                    autoFocus
                                                    disabled={loading}
                                                />
                                            </div>
                                            {errors.otp && <div className="text-danger small mt-1">{errors.otp}</div>}
                                            {message && <div className="text-info small mt-1"><i className="bi bi-info-circle me-1"></i>{message}</div>}
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                            {loading ? "Đang xác thực..." : "Xác nhận OTP"}
                                        </button>
                                        <div className="mt-3 text-center">
                                            <button
                                                type="button"
                                                className="btn btn-link btn-sm text-decoration-none"
                                                onClick={() => { setStep(1); setErrors({}); setMessage(""); }}
                                                disabled={loading}
                                            >
                                                Gửi lại mã hoặc đổi Email
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Step 3 Form */}
                                {step === 3 && (
                                    <form onSubmit={handleResetPassword}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Mật khẩu mới</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <i className="bi bi-key"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập mật khẩu mới"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    disabled={loading}
                                                    autoFocus
                                                />
                                            </div>
                                            {errors.newPassword && <div className="text-danger small mt-1">{errors.newPassword}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <i className="bi bi-key-fill"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className={`form-control ${errors.confirm ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập lại mật khẩu mới"
                                                    value={confirm}
                                                    onChange={e => setConfirm(e.target.value)}
                                                    disabled={loading}
                                                />
                                            </div>
                                            {errors.confirm && <div className="text-danger small mt-1">{errors.confirm}</div>}
                                        </div>

                                        <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                                        </button>

                                        {message && (
                                            <div className="alert alert-success mt-3 p-2 text-center small">
                                                <i className="bi bi-check-circle me-1"></i> {message}
                                            </div>
                                        )}
                                    </form>
                                )}

                                {/* Link quay lại login */}
                                {step !== 3 && (
                                    <div className="mt-3 text-center">
                                        <Link to="/login" className="text-primary text-decoration-underline">
                                            Quay lại đăng nhập
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Styles */}
                        <style>{`
                            .step-circle {
                                width: 38px;
                                height: 38px;
                                border-radius: 50%;
                                background: #e9ecef;
                                color: #6c757d;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 1.3rem;
                                font-weight: 600;
                                transition: background .2s, color .2s;
                            }
                            .step-circle.active {
                                background: #0d6efd;
                                color: #fff;
                                box-shadow: 0 2px 8px rgba(13,110,253,.12);
                            }
                            .step-circle.done {
                                background: #198754;
                                color: #fff;
                            }
                            .step-bar {
                                width: 38px;
                                height: 6px;
                                background: #e9ecef;
                                border-radius: 3px;
                                margin: 0 2px;
                                transition: background .2s;
                            }
                            .step-bar.done {
                                background: #198754;
                            }
                        `}</style>
                    </div>
                </div>
            </div>
        </div>
    );
}