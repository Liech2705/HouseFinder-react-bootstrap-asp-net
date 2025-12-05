import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isProcessed = useRef(false);
    // Hàm xử lý Date an toàn hơn
    const converLock_until = (lock_until) => {
        if (!lock_until || lock_until === "") return null;
        return new Date(lock_until);
    }

    useEffect(() => {
        if (isProcessed.current) return;

        const token = searchParams.get("token");
        if (token) {
            isProcessed.current = true;

            try {
                const decoded = jwtDecode(token);
                console.log("Decoded raw:", decoded);
                const dateLock = converLock_until(decoded.lock_until);
                if (dateLock && dateLock > new Date()) {
                    alert(`Tài khoản của bạn đã bị khóa tới ${dateLock.toLocaleString()}. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.`);
                    navigate('/login');
                    return;
                }
                // --- SỬA LỖI 2: Map đúng key của ASP.NET Core Identity ---
                // Token có thể dùng key ngắn (email) hoặc key dài (http://schemas...) tùy cấu hình backend
                // Code dưới đây hỗ trợ cả 2 trường hợp.
                const roleClaim = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                const emailClaim = decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
                const nameIdClaim = decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
                const nameClaim = decoded.unique_name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

                const userData = {
                    id: Number(nameIdClaim),
                    email: emailClaim,
                    userName: nameClaim,
                    avatar: decoded.picture || decoded.Avatar || "/assets/images/default-avatar.png", // Fallback nếu không có ảnh

                    // --- SỬA LỖI 1: Giữ nguyên Role dạng chuỗi để khớp với Header ---
                    role: roleClaim,

                    lock_until: converLock_until(decoded.lock_until)
                };

                console.log("User Data mapped:", userData);

                // Lưu vào localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));

                // Điều hướng
                const redirectUrl = localStorage.getItem("redirectAfterLogin");
                if (redirectUrl) {
                    localStorage.removeItem("redirectAfterLogin");
                    // Dùng { replace: true } để user không back lại trang loading này được
                    navigate(redirectUrl, { replace: true });

                } else {
                    navigate("/", { replace: true });
                }

            } catch (error) {
                console.error("Lỗi giải mã token:", error);
                // Nếu token lỗi, đá về trang login
                navigate("/login");
            }
        } else {
            // Không có token trên URL -> Về trang chủ hoặc Login
            navigate("/login");
        }
    }, [navigate, searchParams]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Đang xử lý đăng nhập...</p>
            </div>
        </div>
    );
}

export default CallbackPage;