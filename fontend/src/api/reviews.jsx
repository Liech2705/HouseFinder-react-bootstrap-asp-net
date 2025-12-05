import { api } from './api.jsx';

const postReview = async (data) => {
    try {
        const res = await api.post('/Reviews', data);
        return res.data;
    } catch (error) {
        console.log("Lỗi tạo comment : " + error)
    }
}

export { postReview }