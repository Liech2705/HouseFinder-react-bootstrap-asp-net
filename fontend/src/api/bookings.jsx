import { api } from "./api.jsx";

const isPaymentCompleted = async (user_Id, room_Id) => {
    try {
        const response = await api.get(`/Bookings/ispayment/${user_Id}/${room_Id}`);
        return response.data;
    } catch (error) {
        console.error('Error checking payment status:', error);
        return false;
    }
};

export { isPaymentCompleted };