import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { fetchHouseById, createReport } from '../../api/api.jsx';

function ReportForm() {
    // Lấy tất cả ID có thể có
    const { houseId, userId, reviewId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [targetName, setTargetName] = useState(''); // Tên hiển thị (VD: Nhà trọ ABC)

    const user = JSON.parse(localStorage.getItem('user'));
    const reporterId = user?.id;
    const timerRef = useRef(null);

    // --- LOGIC TỰ ĐỘNG XÁC ĐỊNH LOẠI ---
    let targetType = null; // 0: User, 1: House, 3: Review
    let targetId = null;

    if (houseId) { targetType = 1; targetId = houseId; }
    else if (userId) { targetType = 0; targetId = userId; }
    else if (reviewId) { targetType = 3; targetId = reviewId; }

    // 1. Check đăng nhập
    useEffect(() => {
        if (!reporterId) {
            alert("Vui lòng đăng nhập.");
            navigate('/login');
        }
    }, [reporterId, navigate]);

    // 2. Load tên đối tượng để hiển thị (cho User biết mình đang báo cáo cái gì)
    useEffect(() => {
        const loadInfo = async () => {
            if (!targetId) return;

            if (targetType === 1) { // Nếu là House -> Gọi API lấy tên nhà
                try {
                    const data = await fetchHouseById(targetId);
                    setTargetName(`nhà trọ "${data.house_Name}"`);
                } catch { setTargetName(`nhà trọ #${targetId}`); }
            }
            else if (targetType === 0) setTargetName(`người dùng #${targetId}`);
            else if (targetType === 3) setTargetName(`đánh giá #${targetId}`);
        };
        loadInfo();
    }, [targetId, targetType]);

    // Cleanup
    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        // Payload chuẩn gửi về Backend
        const reportData = {
            reporter_Id: reporterId,
            reported_Id: parseInt(targetId),
            type: targetType, // <--- Code tự điền, User không cần chọn
            title: title,
            description: description,
            status: 0,
        };

        try {
            await createReport(reportData);
            setSuccess('Gửi báo cáo thành công!');
            setTitle('');
            setDescription('');
            timerRef.current = setTimeout(() => navigate(-1), 2000);
        } catch (err) {
            setError('Lỗi khi gửi báo cáo. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Nếu URL sai (không có ID nào)
    if (targetType === null) {
        return <Container className="py-5"><Alert variant="danger">Đường dẫn báo cáo không hợp lệ.</Alert></Container>;
    }

    return (
        <Container className="py-5">
            <Card className="shadow-sm" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <Card.Header as="h5" className="bg-danger text-white">
                    <i className="bi bi-flag-fill me-2"></i> Báo cáo vi phạm
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* Dòng thông báo nhỏ thay vì ô Input loại báo cáo */}
                        <p className="text-muted mb-4">
                            Bạn đang báo cáo vi phạm đối với <strong>{targetName || 'đối tượng này'}</strong>.
                        </p>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Vấn đề gặp phải <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="VD: Lừa đảo, Thông tin sai sự thật..."
                                required
                                disabled={isSubmitting || success}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Mô tả chi tiết <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Hãy mô tả rõ hơn về vấn đề..."
                                required
                                disabled={isSubmitting || success}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
                                Hủy
                            </Button>
                            <Button variant="danger" type="submit" disabled={isSubmitting || success}>
                                {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Gửi báo cáo'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ReportForm;