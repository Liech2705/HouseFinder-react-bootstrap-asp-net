import { api } from "./api.jsx";

const isPaymentCompleted = async (user_Id, room_Id) => {
    try {
        const response = await api.get(`/Bookings/ispayment/${user_Id}/${room_Id}`);
        return response.data.result;
    } catch (error) {
        console.error('Error checking payment status:', error);
        return false;
    }
};

const isPaymentCompletedForHost = async (room_Id) => {
    try {
        const response = await api.get(`/Bookings/ispaymentforhost/${room_Id}`);
        return response.data.result;
    } catch (error) {
        console.error('Error checking payment status:', error);
        return false;
    }
};

const deleteBooking = async (booking_Id) => {
    try {
        await api.delete(`/Bookings/${booking_Id}`);
    } catch (err) {
        console.error('Error checking payment status:', err);
        return false;
    }
}

export { isPaymentCompleted, isPaymentCompletedForHost, deleteBooking };