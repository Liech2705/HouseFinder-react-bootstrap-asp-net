import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LockUserModal = ({ show, onHide, onConfirm, user }) => {
    const [lockDate, setLockDate] = useState("");
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        if (!reason) {
            alert("Vui lòng nhập lý do khóa tài khoản!");
            return;
        }
        onConfirm({
            lock_Until: lockDate ? new Date(lockDate) : new Date("9999-12-31T23:59:59Z"),
            reason
        });

        setReason("");
        setLockDate("");
    };

    const handleClearDate = () => setLockDate("");

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Khóa tài khoản</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Tài khoản:</Form.Label>
                        <Form.Control
                            type="text"
                            value={user?.user_Name || ""}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Ngày hết hạn khóa:</Form.Label>
                        <div className="d-flex align-items-center">
                            <Form.Control
                                type="datetime-local"
                                value={lockDate}
                                onChange={(e) => setLockDate(e.target.value)}
                            />
                            <Button
                                variant="outline-secondary"
                                className="ms-2"
                                onClick={handleClearDate}
                            >
                                Xóa
                            </Button>
                        </div>
                        <Form.Text className="text-muted">
                            Nếu để trống, tài khoản sẽ bị khóa vĩnh viễn cho đến khi mở thủ công.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Lý do khóa:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do khóa tài khoản..."
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    Xác nhận khóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LockUserModal;
