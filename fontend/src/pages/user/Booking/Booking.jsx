import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRoomsById, api } from "../../../api/api.jsx";
import { decodeBookingParams } from "../../../utils/encrypt.js";

export default function Booking() {
    const { token } = useParams();
    const navigate = useNavigate();

    // Decode the encrypted parameters
    const decodedParams = token ? decodeBookingParams(token) : null;
    const houseId = decodedParams?.houseId;
    const roomId = decodedParams?.roomId;

    const user = JSON.parse(localStorage.getItem("user")) || {};
    const userId = user?.id ?? user?.user_Id;

    const [room, setRoom] = useState(null);
    const [hostName, setHostName] = useState("");
    const [tenantName, setTenantName] = useState(user?.fullName || user?.userName || "");
    const [price, setPrice] = useState(0);
    const [moveInDate, setMoveInDate] = useState("");
    const [billingCycle, setBillingCycle] = useState("monthly"); // monthly / weekly / onetime
    const [paymentMethod, setPaymentMethod] = useState("vnpay");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!roomId) {
            setError("Invalid booking link. Please try again.");
            return;
        }
        const fetchRoom = async () => {
            try {
                // adjust endpoint if your API differs
                const res = await fetchRoomsById(roomId);
                const data = res;
                setRoom(data);
                setHostName(data?.ownerName || "");
                setPrice(data?.price ?? 0);
                if (data?.check_In_Default) {
                    // Nếu API trả về ngày, đảm bảo nó đúng format
                    setMoveInDate(formatDateToInput(new Date(data.check_In_Default)));
                } else {
                    // Nếu không, lấy ngày hiện tại
                    setMoveInDate(formatDateToInput(new Date()));
                }

            } catch (err) {
                console.error("Lỗi load room:", err);
            }
        };
        fetchRoom();
    }, [roomId]);

    const formatCurrency = (v) => {
        if (v == null) return "";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
    };
    // Hàm chuyển đổi Date sang chuỗi YYYY-MM-DD (giữ nguyên múi giờ máy người dùng)
    const formatDateToInput = (dateObj) => {
        if (!dateObj) return "";
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu < 10
        const day = String(dateObj.getDate()).padStart(2, '0');        // Thêm số 0 nếu < 10
        return `${year}-${month}-${day}`;
    };
    const handlePay = async () => {
        setError("");
        if (!tenantName.trim()) return setError("Vui lòng nhập tên người thuê.");
        if (!moveInDate) return setError("Chọn ngày nhận phòng.");

        const checkIn = new Date(moveInDate);
        const checkOut = new Date(checkIn); // Tạo bản sao
        checkOut.setMonth(checkOut.getMonth() + 1); // Cộng 1 tháng

        // Chuyển thành chuỗi YYYY-MM-DD để gửi API (Lấy phần trước chữ T)
        const checkOutString = checkOut.toISOString().split('T')[0];

        setLoading(true);
        if (paymentMethod === "cash") {
            navigate(`/booking-success`, { replace: true });
            setLoading(false);
        } else if (paymentMethod === "metamask") {
            navigate(`/booking-success`, { replace: true });
            setLoading(false);
            // Xử lý thanh toán MetaMask
        } else if (paymentMethod === "vnpay") {
            try {
                const payload = {
                    roomId: Number(roomId),
                    userId: Number(userId),
                    amount: Number(price),
                    check_In_Date: moveInDate,
                    check_Out_Date: checkOutString,
                    payment_Method: paymentMethod,
                };
                console.log(payload);
                // adjust endpoint if needed
                const res = await api.post("/Bookings/vnpay/pay", payload);
                if (res.data.paymentUrl) {
                    window.location.href = res.data.paymentUrl;   // <-- Chuyển sang VNPay
                } else {
                    alert("Không tạo được link thanh toán VNPay");
                }

                console.log("Payment response:", res);
                // success -> redirect or show message
                setLoading(false);
            } catch (err) {
                console.error("Lỗi tạo booking:", err);
                setError(err?.response?.data?.message || "Tạo booking thất bại, thử lại.");
                setLoading(false);
            }
        }
    };

    return (
        <main className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError("")}></button>
                        </div>
                    )}
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="h5 fw-bold mb-3">Thanh toán đặt phòng</h3>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label text-secondary">Tên phòng</label>
                                <div className="col-sm-8">
                                    <div className="form-control-plaintext">{room?.title || "—"}</div>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label text-secondary">Tên chủ (chủ trọ)</label>
                                <div className="col-sm-8">
                                    <div className="form-control-plaintext">{hostName || "—"}</div>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label text-secondary">Người thuê</label>
                                <div className="col-sm-8">
                                    <input
                                        className="form-control"
                                        value={tenantName}
                                        onChange={(e) => setTenantName(e.target.value)}
                                        placeholder="Tên người thuê"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-4 col-form-label text-secondary">Số tiền thuê</label>
                                <div className="col-sm-8">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="fs-5 fw-bold">{formatCurrency(price)}</div>
                                        <small className="text-muted">/ tháng</small>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label text-secondary">Ngày nhận phòng</label>
                                <div className="col-sm-8">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={moveInDate}
                                        onChange={(e) => setMoveInDate(e.target.value)}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label text-secondary">Chu kỳ thanh toán</label>
                                <div className="col-sm-8">
                                    <select className="form-select" value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
                                        <option value="monthly">Hàng tháng</option>
                                    </select>
                                    <small className="text-muted">Chọn chu kỳ thanh toán theo thỏa thuận.</small>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-4 col-form-label text-secondary">Phương thức thanh toán</label>
                                <div className="col-sm-8">
                                    <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <option value="vnpay">VNPAY</option>
                                        <option value="metamask">MetaMask</option>
                                    </select>
                                </div>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button className="btn btn-primary" onClick={handlePay} disabled={loading}>
                                    {loading ? "Đang xử lý..." : "Thanh toán"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-muted small mt-3">
                        Sau khi thanh toán, vui lòng kiểm tra lịch sử đặt phòng trong trang cá nhân.
                    </div>
                </div>
            </div>
        </main>
    );
}