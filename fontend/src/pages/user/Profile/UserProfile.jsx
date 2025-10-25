import { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquare, Envelope, PersonCircle } from "react-bootstrap-icons";

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"))
                setUser(user);
                if (!user.id) {
                    console.warn("Không tìm thấy thông tin user trong localStorage");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(
                    `https://localhost:7167/api/UserInfor/${user.id}`
                );

                setUserInfo(res.data);
                setFormData(res.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin người dùng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await axios.put(
                `https://localhost:7167/api/UserInfor/${user.id}`,
                formData
            );

            setUserInfo(formData);
            setIsEditing(false);
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            alert("Cập nhật thất bại!");
        }
    };

    if (loading)
        return <div className="text-center mt-5 text-secondary">Đang tải...</div>;

    if (!userInfo)
        return (
            <div className="text-center mt-5 text-muted">
                Không có thông tin người dùng.
            </div>
        );

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div
                className="card shadow-lg border-0 rounded-4 p-4"
                style={{ maxWidth: "700px", width: "100%" }}
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <PersonCircle size={90} className="text-primary mb-3" />
                    <h3 className="fw-bold text-dark">
                        {user.userName}
                    </h3>
                    <p className="text-muted mb-0">
                        <Envelope className="me-2" />
                        {user.email}
                    </p>
                </div>

                <hr />

                {/* Form */}
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Họ và tên</label>
                        <input
                            type="text"
                            className="form-control rounded-3"
                            name="fullName"
                            value={user.userName || "lỗi tên"}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control rounded-3"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Giới tính</label>
                        <select
                            name="gender"
                            className="form-select rounded-3"
                            value={formData.gender || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="">-- Chọn giới tính --</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Ngày sinh</label>
                        <input
                            type="date"
                            className="form-control rounded-3"
                            name="dob"
                            value={formData.dob?.split("T")[0] || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-semibold">Địa chỉ</label>
                        <input
                            type="text"
                            className="form-control rounded-3"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="d-flex justify-content-end mt-4 gap-2">
                    {isEditing ? (
                        <>
                            <button
                                className="btn btn-outline-secondary rounded-pill px-4"
                                onClick={() => {
                                    setFormData(userInfo);
                                    setIsEditing(false);
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                className="btn btn-primary rounded-pill px-4"
                                onClick={handleSave}
                            >
                                Lưu thay đổi
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => setIsEditing(true)}
                        >
                            <PencilSquare className="me-2" /> Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
