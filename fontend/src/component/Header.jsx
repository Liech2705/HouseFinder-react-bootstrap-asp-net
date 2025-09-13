function Header() {
    return (
        <header className="bg-white border-bottom header-full-width">
            <nav className="container d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center gap-2">
                    <img
                        src="../../public/assets/logo/logo_roomfinder.png"
                        alt="RoomFinder logo"
                        width="24"
                        height="24"
                    />
                    <span className="fw-semibold fs-6 text-dark">RoomFinder</span>
                </div>

                <ul className="nav d-none d-md-flex fs-7">
                    <li className="nav-item">
                        <a className="nav-link px-2 text-dark" href="#">
                            Trang chủ
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link px-2 text-dark" href="#">
                            Tìm phòng
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link px-2 text-dark" href="#">
                            Đăng tin
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link px-2 text-dark" href="#">
                            Liên hệ
                        </a>
                    </li>
                </ul>

                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm d-none d-md-inline-block fs-7 fw-semibold">
                        Đăng nhập
                    </button>
                    <button className="btn btn-dark btn-sm fs-7 fw-semibold">
                        Đăng ký
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Header;
