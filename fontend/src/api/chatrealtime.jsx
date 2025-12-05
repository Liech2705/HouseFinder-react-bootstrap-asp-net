import { api } from "./api";
// const API_BASE_URL = '...'; // Khai báo hoặc import API_BASE_URL nếu nó không có trong file này

const getAndPostConversations = async (hostId, userId) => {
    try {

        const response = await api.get(`/ChatConversations/${hostId}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API BoardingHouse:", error.message);
    }
};

const getConversationByUserId = async (userId) => {
    try {
        const response = await api.get(`/ChatConversations/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
    }
};

const getConversationById = async (conversationId) => {
    try {
        const response = await api.get(`/ChatConversations/${conversationId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
    }
};

const getMessagesByConversationId = async (conversationId) => {
    try {
        const response = await api.get(`/ChatConversations/${conversationId}/messages`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error.message);
    }
};

export { getAndPostConversations, getConversationByUserId, getConversationById, getMessagesByConversationId };