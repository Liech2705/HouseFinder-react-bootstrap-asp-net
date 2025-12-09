import { api } from './api.jsx';

const postReview = async (data) => {
    try {
        const res = await api.post('/Reviews', data);
        return res.data;
    } catch (error) {
        console.log("Lỗi tạo comment : " + error)
    }
}
const deleteReview = async (reviewId) => {
    try {
        await api.delete(`/Reviews/${reviewId}`)
    } catch (err) {
        console.log("lỗi xóa comment" + err)
    }
}
export { postReview, deleteReview }