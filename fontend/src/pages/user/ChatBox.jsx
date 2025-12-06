import { useEffect, useState, useRef, use } from "react";
import * as signalR from "@microsoft/signalr";
import { getAndPostConversations, getConversationById, getMessagesByConversationId } from "../../api/api.jsx";

export default function ChatBox({ hostId, userId, conversationId }) {
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const connRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!conversationId) return;
        const fetchConversation = async () => {
            try {
                const res = await getConversationById(conversationId);
                setConversation(res);
            } catch (error) {
                console.error("Lỗi lấy conversation:", error);
            }
        };  
        fetchConversation();
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        let conn = null;
        const initChat = async () => {
            try {
                const res = await getMessagesByConversationId(conversationId);
                setMessages(res || []);

                conn = new signalR.HubConnectionBuilder()
                    .withUrl("https://localhost:7167/chatHub")
                    .withAutomaticReconnect()
                    .build();

                conn.on("ReceiveMessage", (msg) => {
                    setMessages((prev) => {
                        // 1. Kiểm tra xem tin nhắn này đã có trong danh sách chưa (dựa vào ID)
                        const isExist = prev.some((m) => m.message_Id === msg.message_Id);

                        // 2. Nếu có rồi thì không thêm nữa, trả về danh sách cũ
                        if (isExist) return prev;

                        // 3. Nếu chưa có thì mới thêm vào
                        return [...prev, msg];
                    });
                });

                await conn.start();
                await conn.invoke("JoinConversation", conversationId);
                connRef.current = conn;
            } catch (err) {
                console.error("Lỗi kết nối:", err);
            }
        };

        initChat();

        return () => {
            if (connRef.current) {
                connRef.current.invoke("LeaveConversation", conversationId).catch(() => { });
                connRef.current.stop();
            }
        };
    }, [conversationId]);

    useEffect(() => {
        // auto scroll on new messages (small delay to let DOM render)
        if (!listRef.current) return;
        setTimeout(() => {
            try {
                // smooth scroll to bottom
                listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
            } catch (e) { }
        }, 50);
    }, [messages]);

    const send = async () => {
        if (!input.trim() || !connRef.current) return;
        try {
            await connRef.current.invoke("SendMessage", conversationId, Number(userId), input);
            setInput("");
        } catch (err) {
            console.error("Gửi tin nhắn lỗi:", err);
        }
    };

    const getUserName = (msgUserId) => {
        if (!conversation) return "";
        return msgUserId === conversation.user_Id ? conversation.userName : conversation.hostName;
    };

    const isSender = (msgUserId) => msgUserId === Number(userId);

    // IMPORTANT: use flex:1 and minHeight:0 so overflow inside parent works
    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            position: "relative",
            backgroundColor: "#f8f9fa"
        },
        list: {
            flex: 1,
            minHeight: 0,              // <-- thêm
            overflowY: "auto",
            padding: "12px",
            paddingBottom: "80px", // <-- reserve space so input không che messages và xuất hiện scrollbar
            display: "flex",
            flexDirection: "column",
            gap: "8px"
        },
        messageWrapper: (sender) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: sender ? "flex-end" : "flex-start",
        }),
        bubble: (sender) => ({
            background: sender ? "#dcf8c6" : "#fff",
            padding: "8px 12px",
            borderRadius: "12px",
            maxWidth: "70%",
            wordBreak: "break-word"
        }),
        inputRow: {
            display: "flex",
            padding: "8px",
            gap: "8px",
            backgroundColor: "#fff",
            borderTop: "1px solid #ddd",
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            height: 56 // cố định chiều cao để paddingBottom hợp lý
        },
        input: {
            flex: 1,
            padding: "10px 12px",
            borderRadius: 20,
            border: "1px solid #ddd",
            outline: "none"
        },
        sendButton: {
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: 8,
            cursor: "pointer"
        }
    };
    return (
        <div style={styles.container}>

            <div ref={listRef} style={styles.list}>
                {messages?.length ? messages.map((m, idx) => {
                    const sender = isSender(m.user_Id);
                    return (
                        <div key={`${m.message_Id ?? "msg"}-${m.timestamp ?? idx}-${idx}`} style={styles.messageWrapper(sender)}>
                            {!sender && <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>{getUserName(m.user_Id)}</div>}
                            <div style={styles.bubble(sender)}>
                                <div>{m.content}</div>
                                <div style={{ fontSize: 10, color: "#777", textAlign: "right", marginTop: 4 }}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </div>
                            </div>
                        </div>
                    );
                }) : <div style={{ color: "#888", textAlign: "center", marginTop: 20 }}>Chưa có tin nhắn</div>}
            </div>

            <div style={styles.inputRow}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    style={styles.input}
                />
                <button onClick={send} style={styles.sendButton}>Gửi</button>
            </div>
        </div>
    );
}
