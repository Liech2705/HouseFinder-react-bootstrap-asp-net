import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from './auth.jsx';
import { jwtDecode } from "jwt-decode";

export default function SocialComplete() {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
        userType: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUser({
                email: decoded.email,
                userName: decoded.unique_name || decoded.name,
                avatar: decoded.picture
            });
        }
    }, [token]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'userType' ? Number(value) : value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password.length < 6) return alert('Mật khẩu ít nhất 6 ký tự');
        if (form.password !== form.confirmPassword) return alert('Mật khẩu xác nhận không khớp');
        setLoading(true);
        try {
            const userData = {
                firstName: user.userName,
                lastName: "",
                email: user.email,
                phone: "0000000000",
                password: form.password,
                userType: form.userType,
                picture: user.avatar
            };
            await register(userData);
            alert('Đăng ký thành công!');

            const lsUserData = {
                email: user.email,
                userName: user.userName,
                picture: user.avatar
            };
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(lsUserData));
            navigate('/');
        } catch {
            alert('Có lỗi xảy ra, thử lại sau');
        }
        setLoading(false);
    };

    if (!token) return <div>Không tìm thấy token xác thực.</div>;
    if (!user) return <div>Đang tải thông tin...</div>;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="mb-3">Hoàn tất đăng ký tài khoản</h3>
                            <div className="mb-3 text-center">
                                <img src={user.avatar || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXU1NT////R0dHV1dX09PTf39/8/Pzb29vu7u7x8fHl5eX5+fnc3Nzr6+vi4uLw8PCR9fa8AAAFQElEQVR4nO2d6ZKjMAyEjQzmSsj7v+2gMBnIHcCy2hl9Vbs/9qiaLtmSfDXOGYZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhbIOI/n59D97z76MmXw/dsS2Z9tgNtf/VOf2DvCFXd20fimtC33a1yzyYU3Sq5lbcQmZTLf5ljlDd9E/lTfRNnXEgq/KNvImy0v5Bt0HVu/AtAlllF0dPh7J4Pv9uCUVZU1aTkVzzsboLTU6Jdc0AncloqNKxWDFCL4z/45iHRPKfZdBHlD4DjVSvD98ikPDF0VO1Qx9ToefUvQJHidoSXkJV2DNGmRCgU+r+CIJHsY4isChqbSHP8Fvq/CN61GSzvQ7eUmpLeQh3MtEA7G58pCxzoQJc9++uE0tC0JZzB61fLr2mQRunh8gCi+KgLekaKmOOUSaUWEGMm2YmoFobilcKZ5CCuHvJ9BigIIqEECiIPlrHfUuNUvaj18ILODUxajszg9PYyOQZBiTX0ElM4QlkmMqMUQZkmEplUgZjP6MTjGGnLY6hVkxgUbQIE5Fi7T89okdQ6AUFFoV+U+MF1r5LDgCNWyeqECDVRN1EvAdgW1Gs7Z4AaL4FezYGoG8TWv1eAFgFm0JTaAoBFEo23hCt9z+oh8Jdm75CN4gqHLTlCW4HTyBsCn/7+pDX+IL7NBBrfMlyEQCKheMlsFQQA8IC2P2H/VISnIcQg/Q/nFt8/dmT3NEMyMGM84JnwAgFn5E7x0fh2+9iOKlcA5NnnND5E0RP+kcVvXMLUCEUmYlIs3CEBO6XYin8B3eEKXJjEwBflMa+q4/Ht7+3YNa83n5FAH0zM7an0d494TSk11C0t2uYYzTGE9kJ5IeyUSRCvyHdLTGgC9z9EjgEtGbtDu/2vsfHnYN/7PJU0P7hP2NzdwPaydzjN3ubZBJCx+4fG/xpcnD9WMAeQ2so4XPoPcQ+WJ/k1cBeWPnp4+N3+tjri7K1bKP6+Nav7QjbZ3+Cd+QOp9eee5Rr+H7hwUrsm3gfvLarKd/heQP7XLL3ZdMyJ/a+/DKPzylSZ+dSOjuYum+JnWEYhmEYf0xlnr27L8x/lj+jDH/omrbvF9uMIfR923QH7zJXSZNZ+au109m2PFeV5IZ2Ctuz5dPv37YD4IHvS85dth/WbNSUg8+rG6f6hdX8k3hm5M1ONGw7Ku2HPGbktu3gX434e27TdvfWs5mAr5Hq/be/SuT5GOnCCeYBjeePBUS7i3EgD1c5KPqNIbRAstd8vJtt4ew/jxTFcYRGv0GLdRhF8V93haIDOjAV8jfByal0EnmfF2CePVEr9AAxYNz19qKmCi3CXBwjKPYAMRStsjovbalwvtGuGsZRoNwLUiYoX9pnywhphYrGEV72kfNMrbaBQ07SUHCmV+vChc13ZrTKorBvyxKlqbjrquw6gsbzBNle5pZSo7dJN0aZ9AYZ3qcbo0xI/lVd8W7tluStTZpavyRxshF2aXtEYjOe9CFMHMT4n5V5T9oPz9TCK4qHClMGUdh39hkpN6bSR5AJ6Upi2nZmJlljk7QjXZIs12jkGSZZrqGjmsJE+/yiH0N4TSLLGo1+5kKaYaqVSZkk2VQtkzJpsqlOmplI4lGnOQ3TTEQ5u9L3JDE0Tb59cU2CzQzVRJMm1ejVe6aXF+gVpyFPRPkVlOzHj94j/5lgWZP594jb0At//Og90ssLOb/ZTxH3pVXahJoR345SLofyBTHtqeFjhdKjVF+hrEBTaApzUJj+4PAa8WNEgIovrNCpd23SAhNehHrM6utRP3IESPnqlEjaAAAAAElFTkSuQmCC'} alt="avatar" className="rounded-circle" width={64} height={64} />
                                <div className="fw-semibold mt-2">{user.userName}</div>
                                <div className="text-secondary">{user.email}</div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Bạn là ai?</label>
                                    <div className="d-flex gap-3">
                                        <label>
                                            <input type="radio" name="userType" value={0} checked={form.userType === 0} onChange={handleChange} /> Người thuê
                                        </label>
                                        <label>
                                            <input type="radio" name="userType" value={1} checked={form.userType === 1} onChange={handleChange} /> Chủ nhà
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Tạo mật khẩu</label>
                                    <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} minLength={6} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Xác nhận mật khẩu</label>
                                    <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}