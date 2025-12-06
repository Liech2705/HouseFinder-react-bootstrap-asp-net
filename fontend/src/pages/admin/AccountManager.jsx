import { useEffect, useState } from "react";
import { usersFetch, lockUser, unlockUser, getAndPostConversations } from "../../api/api.jsx";
import { Button, Table, Form, Modal } from "react-bootstrap";
import LockUserModal from "../../components/admin/LockUserModal.jsx";

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [showLockModal, setShowLockModal] = useState(false);
    const [userToLock, setUserToLock] = useState(null);

    // Gọi API lấy danh sách tài khoản (trừ admin)
    const fetchUsers = async () => {
        try {
            const usersFet = await usersFetch(); // ẩn tài khoản admin
            setUsers(usersFet);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {

        fetchUsers();
        const hash = window.location.hash.substring(1);
        if (hash) {
            setTimeout(() => {
                const target = document.getElementById(hash);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "center" });
                    target.classList.add("table-active");
                }
            }, 500);
        }
    }, []);
    const openLockModal = (user) => {
        setUserToLock(user);
        setShowLockModal(true);
    };
    const confirmLock = async (lockData) => {
        try {
            await lockUser(userToLock.user_Id, lockData);
            setShowLockModal(false);
            fetchUsers();
        } catch (err) {
            console.error("Lỗi khi khóa tài khoản:", err);
        }
    };

    const openChatWithHost = async (hostid) => {
        try {
            let userid = JSON.parse(localStorage.getItem('user'))?.id;
            if (!userid) {
                alert("Vui lòng đăng nhập để chat với chủ trọ");
                return;
            }
            const response = await getAndPostConversations(hostid, userid);
            const convId = response.conversation_Id;
            window.dispatchEvent(new CustomEvent('openChat', {
                detail: { conversationId: convId, hostId: hostid }
            }));
        } catch (err) {
            console.error('Lỗi khi mở chat:', err);
            window.dispatchEvent(new CustomEvent('openChat', { detail: { hostId: hostid } }));
        }
    };

    // Mở khóa tài khoản
    const handleUnlock = async (id, reason = "Unlock by admin") => {
        await unlockUser(id, reason);
        fetchUsers();
    };

    // Gửi tin nhắn
    const handleSendMessage = (user) => {
        setSelectedUser(user);
        setShowMessageModal(true);
    };

    const sendMessage = () => {
        alert(`Gửi tin nhắn tới ${selectedUser.user_Name}: ${message}`);
        setMessage("");
        setShowMessageModal(false);
    };

    // Tìm kiếm theo tên hoặc email
    const filteredUsers = users.filter(
        (u) =>
            u.user_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">Quản lý tài khoản người dùng</h3>

            {/* Thanh tìm kiếm */}
            <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Bảng hiển thị */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>#</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((u, i) => (
                        <tr key={u.user_Id} id={u.user_Id} className="text-center">
                            <td>{i + 1}</td>
                            <td>{u.user_Name}</td>
                            <td>{u.email}</td>
                            <td>{u.role === "User" ? "Người dùng" : "Chủ trọ"}</td>
                            <td>
                                {u.lock_Until ? new Date(u.lock_Until).getFullYear() == 9999 ? "Vĩnh viễn" : `Bị khóa đến ${new Date(u.lock_Until).toLocaleDateString()}`
                                    : "Hoạt động"}
                            </td>
                            <td>
                                {u.lock_Until ? (
                                    <Button variant="success" size="sm" onClick={() => handleUnlock(u.user_Id, "Unlock by admin")}>
                                        Mở khóa
                                    </Button>
                                ) : (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => openLockModal(u)}
                                    >
                                        Khóa
                                    </Button>
                                )}
                                <Button
                                    variant="info"
                                    size="sm"
                                    className="ms-2"
                                    onClick={() => openChatWithHost(u.user_Id)}
                                >
                                    Nhắn tin
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal gửi tin nhắn */}
            <LockUserModal
                show={showLockModal}
                onHide={() => setShowLockModal(false)}
                onConfirm={confirmLock}
                user={userToLock}
            />
        </div>
    );
};

export default AdminUserManagement;
