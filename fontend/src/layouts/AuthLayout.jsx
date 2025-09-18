
const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    {/* Left side - Image/Illustration */}
                                    <div className="col-lg-6 d-none d-lg-block bg-gradient-primary">
                                        <div className="p-5 h-100 d-flex flex-column justify-content-center align-items-center text-white">
                                            <div className="text-center">
                                                <img
                                                    src="/assets/logo/logo_roomfinder.png"
                                                    alt="HouseFinder Logo"
                                                    className="mb-4"
                                                    style={{ maxWidth: '200px', height: 'auto' }}
                                                />
                                                <h2 className="fw-bold mb-3">Chào mừng đến với HouseFinder</h2>
                                                <p className="lead mb-4">
                                                    Tìm kiếm ngôi nhà hoàn hảo cho bạn và gia đình.
                                                    Hàng nghìn lựa chọn phòng trọ, căn hộ chất lượng cao.
                                                </p>
                                                <div className="d-flex justify-content-center">
                                                    <div className="me-4 text-center">
                                                        <div className="fs-2 fw-bold">1000+</div>
                                                        <div className="small">Phòng trọ</div>
                                                    </div>
                                                    <div className="me-4 text-center">
                                                        <div className="fs-2 fw-bold">500+</div>
                                                        <div className="small">Chủ nhà</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="fs-2 fw-bold">4.9</div>
                                                        <div className="small">Đánh giá</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side - Form */}
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center mb-4">
                                                <h1 className="h4 text-gray-900 mb-4">{title}</h1>
                                                <p className="text-muted">{subtitle}</p>
                                            </div>
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
