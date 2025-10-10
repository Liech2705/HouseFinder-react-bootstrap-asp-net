
export default function Dashboard() {
    return (
        <div className="dashboard-main container-fluid px-0">
            <div className="row justify-content-center mb-4">
                <div className="col-12 col-lg-10">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 py-3 px-2 px-md-4 bg-white rounded-4 shadow-sm mb-3">
                        <div>
                            <h2 className="fw-bold text-primary d-flex align-items-center mb-1">
                                Dashboard Quản trị
                            </h2>
                            <p className="text-muted fs-5 mb-0">Chào mừng bạn! Xem nhanh số liệu hệ thống.</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary rounded-pill px-4">
                                <i className="bi bi-plus-circle me-2"></i> Thêm phòng
                            </button>
                            <button className="btn btn-outline-success rounded-pill px-4">
                                <i className="bi bi-person-plus me-2"></i> Thêm người dùng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Cards */}
            <div className="row justify-content-center g-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card dashboard-card border-0 shadow-sm text-center py-4 px-2 h-100">
                        <div className="dashboard-card-icon bg-info mb-3 mx-auto">
                            <i className="bi bi-house-door text-white fs-2"></i>
                        </div>
                        <h6 className="fw-semibold text-info mb-1">Phòng hoạt động</h6>
                        <div className="fs-3 fw-bold text-dark">120</div>
                        <div className="text-muted small">Đang cho thuê</div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card dashboard-card border-0 shadow-sm text-center py-4 px-2 h-100">
                        <div className="dashboard-card-icon bg-warning mb-3 mx-auto">
                            <i className="bi bi-file-earmark-text text-white fs-2"></i>
                        </div>
                        <h6 className="fw-semibold text-warning mb-1">Tin đăng mới</h6>
                        <div className="fs-3 fw-bold text-dark">35</div>
                        <div className="text-muted small">Trong tuần này</div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card dashboard-card border-0 shadow-sm text-center py-4 px-2 h-100">
                        <div className="dashboard-card-icon bg-success mb-3 mx-auto">
                            <i className="bi bi-person text-white fs-2"></i>
                        </div>
                        <h6 className="fw-semibold text-success mb-1">Người dùng</h6>
                        <div className="fs-3 fw-bold text-dark">210</div>
                        <div className="text-muted small">Đã đăng ký</div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card dashboard-card border-0 shadow-sm text-center py-4 px-2 h-100">
                        <div className="dashboard-card-icon bg-danger mb-3 mx-auto">
                            <i className="bi bi-exclamation-triangle text-white fs-2"></i>
                        </div>
                        <h6 className="fw-semibold text-danger mb-1">Báo cáo vi phạm</h6>
                        <div className="fs-3 fw-bold text-dark">5</div>
                        <div className="text-muted small">Trong tháng này</div>
                    </div>
                </div>
            </div>
            {/* Chart section */}
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-lg-10">
                    <div className="card shadow border-0">
                        <div className="card-body">
                            <h4 className="fw-bold mb-3">
                                <i className="bi bi-bar-chart-line me-2 text-primary"></i>
                                Biểu đồ hoạt động (Demo)
                            </h4>
                            <div className="text-center text-muted py-5">
                                <i className="bi bi-graph-up-arrow fs-1"></i>
                                <div>Biểu đồ sẽ hiển thị ở đây (tích hợp sau)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Custom CSS */}
            <style>{`
                .dashboard-card {
                    border-radius: 1.2rem;
                    transition: box-shadow .2s;
                }
                .dashboard-card:hover {
                    box-shadow: 0 8px 32px rgba(13,110,253,0.12);
                }
                .dashboard-card-icon {
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }
                @media (max-width: 575px) {
                    .dashboard-card {
                        padding: 1.2rem 0.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}