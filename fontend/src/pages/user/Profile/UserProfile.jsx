import { useEffect, useState } from "react";
import { getUserProfile, uploadAvatar } from "../../../api/api.jsx";
import { PencilSquare, Envelope } from "react-bootstrap-icons";

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const API_ROOT = import.meta.env.VITE_URL_ROOT || "";

    // --- HELPER: CHUYỂN ĐỔI GIỚI TÍNH ---
    // Server trả về "Male" -> UI hiển thị 0
    const mapGenderToValue = (genderStr) => {
        if (genderStr === "Male") return "0";
        if (genderStr === "Female") return "1";
        return "2"; // Other
    };

    // UI chọn 0 -> Gửi lên Server "Male"
    const mapValueToGender = (value) => {
        if (value == "0") return "Male";
        if (value == "1") return "Female";
        return "Other";
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                setUser(storedUser);

                if (!storedUser?.id) {
                    setLoading(false);
                    return;
                }

                const res = await getUserProfile(storedUser.id);
                setUserInfo(res);

                // --- MAP DỮ LIỆU TỪ API VÀO FORM ---
                setFormData({
                    ...res,
                    userName: storedUser.userName,
                    // SỬA: Chuyển "Male" thành "0" để select box hiểu
                    gender: mapGenderToValue(res.gender),
                    // SỬA: Đảm bảo ngày tháng hiển thị đúng
                    dob: res.dob ? res.dob.split("T")[0] : ""
                });

                if (res.avatar) {
                    setPreview(API_ROOT + res.avatar);
                } else {
                    setPreview(null);
                }

            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            // Chỉ cho nhập số
            const cleaned = value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, [name]: cleaned });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const newErrors = {};
        if (!formData.userName?.trim()) newErrors.userName = "Vui lòng nhập họ và tên.";
        if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại.";
        else if (formData.phone.length !== 10) newErrors.phone = "Số điện thoại phải gồm 10 số.";
        if (!formData.address) newErrors.address = "Vui lòng chọn địa chỉ.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        console.log("Dữ liệu form:", formData);

        try {
            const dataToSend = new FormData();
            dataToSend.append("UserName", formData.userName);
            dataToSend.append("Phone", formData.phone);
            dataToSend.append("Address", formData.address);

            if (formData.dob) {
                dataToSend.append("Dob", formData.dob);
            }

            // --- QUAN TRỌNG: CHUYỂN NGƯỢC LẠI THÀNH TEXT KHI FETCH UI ---
            const genderString = mapValueToGender(formData.gender);
            dataToSend.append("Gender", formData.gender);

            dataToSend.append("Infor_Id", formData.infor_Id);

            if (avatarFile) {
                dataToSend.append("AvatarFile", avatarFile);
            }

            // Gọi API Upload/Update
            let response = await uploadAvatar(user.id, dataToSend);

            alert("Cập nhật thành công!");

            // Cập nhật LocalStorage & State
            const newAvatarUrl = response.avatar || userInfo.avatar; // Lấy ảnh mới hoặc giữ ảnh cũ

            const newUserObj = {
                ...user,
                userName: formData.userName,
                avatar: newAvatarUrl
            };
            localStorage.setItem("user", JSON.stringify(newUserObj));

            setUser(newUserObj);
            // Cập nhật lại userInfo gốc để nút Hủy hoạt động đúng
            setUserInfo({
                ...userInfo,
                ...formData,
                gender: genderString, // Lưu gender dạng text vào state gốc
                avatar: newAvatarUrl
            });
            setIsEditing(false);

            if (newAvatarUrl) {
                setPreview(API_ROOT + newAvatarUrl);
            }
            setAvatarFile(null);

        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Cập nhật thất bại!");
        }
    };

    const handleCancel = () => {
        // Reset form về giá trị gốc (lúc chưa sửa)
        setFormData({
            ...userInfo,
            userName: user.userName,
            // Map lại gender gốc từ Text -> Số
            gender: mapGenderToValue(userInfo.gender),
            dob: userInfo.dob ? userInfo.dob.split("T")[0] : ""
        });

        if (userInfo.avatar) {
            setPreview(API_ROOT + userInfo.avatar);
        } else {
            setPreview(null);
        }

        setAvatarFile(null);
        setErrors({});
        setIsEditing(false);
    }

    if (loading) return <div className="text-center mt-5">Đang tải...</div>;
    if (!userInfo) return <div className="text-center mt-5">Không có thông tin.</div>;

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "700px", width: "100%" }}>

                {/* Avatar Section */}
                <div className="text-center mb-4 position-relative">
                    <div className="position-relative d-inline-block">
                        <img
                            src={preview || "/default-avatar.png"}
                            alt="Avatar"
                            className="rounded-circle shadow-sm"
                            width={120}
                            height={120}
                            style={{ objectFit: "cover", border: "3px solid #e3e3e3", backgroundColor: "#f8f9fa" }}
                        />
                        {isEditing && (
                            <label className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm" style={{ cursor: "pointer" }}>
                                <i className="bi bi-camera-fill fs-5"></i>
                                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                            </label>
                        )}
                    </div>
                    <h4 className="fw-bold text-dark mt-3">{user.userName}</h4>
                    <p className="text-muted mb-0"><Envelope className="me-2" />{user.email}</p>
                </div>

                <hr />

                {/* Form Fields */}
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Họ và tên</label>
                        <input type="text" className="form-control" name="userName"
                            value={formData.userName || ""} onChange={handleChange} disabled={!isEditing} />
                        {errors.userName && <div className="text-danger small">{errors.userName}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Số điện thoại</label>
                        <input type="text" className="form-control" name="phone"
                            value={formData.phone || ""} onChange={handleChange} disabled={!isEditing} />
                        {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Giới tính</label>
                        <select name="gender" className="form-select"
                            value={formData.gender} onChange={handleChange} disabled={!isEditing}>
                            {/* Value ở đây là chuỗi "0", "1", "2" khớp với hàm mapGenderToValue */}
                            <option value="0">Nam</option>
                            <option value="1">Nữ</option>
                            <option value="2">Khác</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Ngày sinh</label>
                        <input type="date" className="form-control" name="dob"
                            value={formData.dob || ""} onChange={handleChange} disabled={!isEditing} />
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-semibold">Địa chỉ</label>
                        <input type="text" className="form-control" name="address"
                            value={formData.address || ""} onChange={handleChange} disabled={!isEditing} />
                        {errors.address && <div className="text-danger small">{errors.address}</div>}
                    </div>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-end mt-4 gap-2">
                    {isEditing ? (
                        <>
                            <button className="btn btn-outline-secondary rounded-pill px-4" onClick={handleCancel}>Hủy</button>
                            <button className="btn btn-primary rounded-pill px-4" onClick={handleSave}>Lưu thay đổi</button>
                        </>
                    ) : (
                        <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => setIsEditing(true)}>
                            <PencilSquare className="me-2" /> Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;