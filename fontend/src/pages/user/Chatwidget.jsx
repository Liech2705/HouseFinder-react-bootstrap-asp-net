import { useState, useEffect } from "react";
import { getAndPostConversations, getConversationByUserId } from "../../api/api.jsx";
import ChatBox from "./ChatBox.jsx";
import { MessageCircle } from "lucide-react";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?.user_Id;

    useEffect(() => {
        const handleOpenChat = async (e) => {
            const { conversationId, hostId } = e?.detail || {};
            if (!userId) {
                alert("Vui lòng đăng nhập để sử dụng tính năng chat.");
                return;
            }
            let convId = conversationId;
            try {
                if (!convId && hostId) {
                    // tạo hoặc lấy conversation nếu caller không trả id
                    const res = await getAndPostConversations(hostId, userId);
                }
                if (convId) {
                    // set selected conv object so ChatBox receives props
                    setSelectedConv({ conversation_Id: convId, host_Id: hostId, /* optional fields */ });
                    setIsOpen(true);
                }
            } catch (err) {
                console.error("Không thể mở cuộc trò chuyện:", err);
            }
        };

        window.addEventListener("openChat", handleOpenChat);
        return () => window.removeEventListener("openChat", handleOpenChat);
    }, [userId]);

    // 📩 Lấy danh sách cuộc hội thoại
    useEffect(() => {
        if (!isOpen) return;
        const fetchData = async () => {
            try {
                const res = await getConversationByUserId(userId);
                setConversations(res || []);
            } catch (err) {
                console.error("Lỗi tải danh sách hội thoại:", err);
            }
        };
        fetchData();
    }, [isOpen, userId]);

    // 🧠 Hàm lấy tên người còn lại trong cuộc trò chuyện
    const getPartnerName = (conv) => {
        if (conv.host_Id === userId) return conv.userName || `Người dùng #${conv.user_Id}`;
        else return conv.hostName || `Chủ trọ #${conv.host_Id}`;
    };

    // 🧠 Lấy tin nhắn cuối cùng
    const getLastMessage = (conv) => {
        if (conv.chatMessages && conv.chatMessages.length > 0) {
            return conv.chatMessages[conv.chatMessages.length - 1].content;
        }
        return "Chưa có tin nhắn";
    };

    return (
        <>
            {/* 💬 Bong bóng nhỏ */}
            {!!user && (<div
                onClick={() => setIsOpen((prev) => !prev)}
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                }}
            >
                <MessageCircle size={30} />
            </div>)}


            {/* 🪟 Popup hội thoại */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 90,
                        right: 20,
                        width: 350,
                        height: 450,
                        background: "white",
                        borderRadius: 12,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        zIndex: 1001,
                    }}
                >
                    {!selectedConv ? (
                        <>
                            {/* Header */}
                            <div
                                style={{
                                    background: "#4CAF50",
                                    color: "#fff",
                                    padding: "10px 16px",
                                    fontWeight: "bold",
                                }}
                            >
                                💬 Danh sách cuộc trò chuyện
                            </div>

                            {/* Danh sách hội thoại */}
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    padding: "8px 0",
                                }}
                            >
                                {conversations.length === 0 ? (
                                    <p style={{ textAlign: "center", color: "#888" }}>
                                        Chưa có cuộc hội thoại nào.
                                    </p>
                                ) : (
                                    conversations.map((conv) => {
                                        const partnerName = getPartnerName(conv);
                                        const lastMsg = getLastMessage(conv);
                                        const avatarLetter = partnerName?.charAt(0)?.toUpperCase() || "?";

                                        return (
                                            <div
                                                key={conv.conversation_Id}
                                                onClick={() => setSelectedConv(conv)}
                                                style={{
                                                    padding: "10px 16px",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #eee",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 10,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "50%",
                                                        background: "#4CAF50",
                                                        color: "white",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        fontWeight: "bold",
                                                        textTransform: "uppercase",
                                                    }}
                                                >
                                                    {avatarLetter}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: "bold" }}>{partnerName}</div>
                                                    <div
                                                        style={{
                                                            fontSize: 12,
                                                            color: "#666",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        <span>{lastMsg}</span>
                                                        {/* Thời gian gửi tin nhắn */}
                                                        <span style={{ fontSize: 10, color: "#999" }}>
                                                            {new Date(conv.last_Message_At).toLocaleTimeString("vi-VN", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bubble-chat" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                            {/* Header cuộc trò chuyện */}
                            <div
                                style={{
                                    background: "#4CAF50",
                                    color: "#fff",
                                    padding: "10px 16px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span>💬 {getPartnerName(selectedConv)}</span>
                                <button
                                    onClick={() => setSelectedConv(null)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontSize: 18,
                                    }}
                                >
                                    ←
                                </button>
                            </div>

                            {/* Chat box */}
                            <ChatBox
                                hostId={selectedConv.host_Id}
                                userId={userId}
                                conversationId={selectedConv.conversation_Id}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
