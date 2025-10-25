function Footer() {
    return (
        <footer className="border-top bg-white text-secondary fs-8">
            <div className="container py-4 d-grid gap-4 gap-sm-0" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
                <div>
                    <p className="fw-semibold text-dark mb-2">RoomFinder</p>
                    <p>Nền tảng tìm kiếm phòng trọ tại Việt Nam</p>
                </div>
                <div>
                    <p className="fw-semibold text-dark mb-2">Dịch vụ</p>
                    <ul className="list-unstyled mb-0">
                        <li>
                            <a href="#" className="text-secondary text-decoration-none">
                                Tìm phòng trọ
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-secondary text-decoration-none">
                                Đăng tin cho thuê
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-secondary text-decoration-none">
                                Quản lý tin đăng
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="fw-semibold text-dark mb-2">Hỗ trợ</p>
                    <ul className="list-unstyled mb-0">
                        <li>
                            <a href="#" className="text-secondary text-decoration-none">
                                Trung tâm trợ giúp
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-secondary text-decoration-none">
                                Liên hệ
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-secondary text-decoration-none">
                                Báo cáo sự cố
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="fw-semibold text-dark mb-2">Liên hệ</p>
                    <p>
                        Email:{" "}
                        <a href="mailto:support@roomfinder.vn" className="text-secondary text-decoration-none">
                            support@roomfinder.vn
                        </a>
                    </p>
                    <p>Hotline: 1900 1234</p>
                    <p>Địa chỉ: Hà Nội, Việt Nam</p>
                </div>
            </div>
            <div className="border-top text-center py-2 fs-9 text-muted">
                © 2024 RoomFinder. Tất cả quyền được bảo lưu.
            </div>
        </footer>
    );
}

export default Footer;
