import { useEffect, useState } from "react";
import { Table, Button, Modal, Badge, Spinner } from "react-bootstrap";
import { Eye, CheckCircle, XCircle } from "lucide-react"; // 🧩 Gói icon cực đẹp
import { fetchReport } from "../../api/api.jsx";
import axios from "axios";

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await fetchReport();
            setReports(res);
        } catch (err) {
            console.error("Error loading reports", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleView = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await axios.put(
                `https://localhost:7167/api/Reports/status/${id}`,
                (JSON.stringify(newStatus)),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            fetchReports();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa báo cáo này không?")) {
            try {
                await axios.delete(`https://localhost:7167/api/Reports/${id}`);
                fetchReports();
            } catch (err) {
                console.error("Error deleting report:", err);
            }
        }
    };

    const handleAction = async (type, id) => {
        try {
            switch (type) {
                case "House":
                    // 🔹 Mở trang chi tiết nhà trọ
                    window.location.href = `/houses/${id}`;
                    break;

                case "Review": {
                    // 🔹 Gọi API lấy danh sách nhà trọ, tìm house chứa room này
                    alert("Comming soon: Chức năng tìm nhà trọ từ đánh giá.");
                    break;
                }
                case "Message":
                    // 🔹 Mở trang quản lý tin nhắn, cuộn tới message có id tương ứng
                    window.location.href = `/admin/accounts#${id}`;
                    break;

                case "User":
                    // 🔹 Chuyển tới trang tài khoản, cuộn tới user có id tương ứng
                    window.location.href = `/admin/accounts#${id}`;
                    break;

                default:
                    console.warn("Loại report không xác định:", type);
            }
        } catch (err) {
            console.error("Lỗi khi xử lý hành động:", err);
            alert("Không thể truy xuất dữ liệu.");
        }
    };


    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return <Badge bg="warning" text="dark">⏳ Chờ duyệt</Badge>;
            case "Reviewed":
                return <Badge bg="info">👁️ Đã xem</Badge>;
            case "Rejected":
                return <Badge bg="danger">❌ Từ chối</Badge>;
            default:
                return <Badge bg="success">✅ Hoàn tất</Badge>;
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-primary mb-0">📋 Quản lý báo cáo vi phạm</h3>
                <Button variant="outline-primary" onClick={fetchReports}>
                    🔄 Làm mới
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="table-responsive shadow rounded-4 overflow-hidden">
                    <Table hover className="responsive bordered hover align-middle mb-0">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>#</th>
                                <th>Người báo cáo</th>
                                <th>Đối tượng</th>
                                <th>Loại</th>
                                <th>Tiêu đề</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((r, index) => (
                                    <tr key={r.report_Id} className="table-row-hover">
                                        <td>{index + 1}</td>
                                        <td className="fw-medium text-secondary">{r.reporter_Name}</td>
                                        <td>{r.reported_Title}</td>
                                        <td>
                                            <Badge bg="secondary">{r.type}</Badge>
                                        </td>
                                        <td>{r.title}</td>
                                        <td>{getStatusBadge(r.status)}</td>
                                        <td className="text-center">
                                            <Button
                                                size="sm"
                                                variant="info"
                                                className="me-2 text-white"
                                                onClick={() => handleView(r)}
                                            >
                                                <Eye size={16} /> Xem
                                            </Button>

                                            {(r.status === "Resolved" || r.status === "Rejected") ? (
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    className="me-2 text-white"
                                                    onClick={() => handleDelete(r.report_Id)}>
                                                    Xóa
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="me-2"
                                                        onClick={() => handleUpdateStatus(r.report_Id, "Resolved")}
                                                    >
                                                        <CheckCircle size={16} /> Duyệt
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="warning"
                                                        className="me-2 text-dark"
                                                        onClick={() => handleUpdateStatus(r.report_Id, "Rejected")}
                                                    >
                                                        <XCircle size={16} /> Từ chối
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        Không có báo cáo nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* 🟦 Modal chi tiết */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>📄 Chi tiết báo cáo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReport && (
                        <div className="p-2">
                            <p><strong>Tiêu đề:</strong> {selectedReport.title}</p>
                            <p><strong>Mô tả:</strong> {selectedReport.description}</p>
                            <p><strong>Người báo cáo:</strong> {selectedReport.reporter_Name}</p>
                            <p><strong>Đối tượng bị báo cáo:</strong> {selectedReport.reported_Title}</p>
                            <p>
                                <strong>Loại:</strong>
                                <Badge bg="secondary">{selectedReport.type}</Badge>
                                <Button
                                    size="sm"
                                    variant="info"
                                    className="badge ms-2"
                                    onClick={() => handleAction(selectedReport.type, selectedReport.reported_Id)}>
                                    ?
                                </Button>
                            </p>
                            <p><strong>Trạng thái:</strong> {getStatusBadge(selectedReport.status)}</p>
                            <p><strong>Ngày tạo:</strong> {new Date(selectedReport.created_At).toLocaleString()}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 🧩 Style thêm */}
            <style>{`
            @media (max-width: 768px) {
            .report-card {
                padding: 8px;
                font-size: 14px;
            }
            table td, table th {
                white-space: nowrap;
            }
            }

        .table-row-hover:hover {
          background-color: #f8f9fa;
          transition: background 0.3s ease;
        }
        .table thead th {
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .table td {
          vertical-align: middle;
        }
      `}</style>
        </div>
    );
};

export default ReportsPage;
