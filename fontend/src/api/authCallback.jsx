import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

function CallbackPage() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);

            const userData = {
                email: decoded.email,
                userName: decoded.unique_name,
                picture: decoded.picture
            }
            // Lưu vào localStorage
            localStorage.setItem("jwt", token);
            localStorage.setItem("user", JSON.stringify(userData));

            // Redirect về trang chủ
            window.location.href = "/";
        }
    }, []);

    return <div>Đang đăng nhập...</div>;
}

export default CallbackPage;
