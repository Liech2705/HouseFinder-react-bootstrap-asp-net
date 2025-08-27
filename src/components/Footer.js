const Footer = () => {
  return (
    <footer className="py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-house-door me-2"></i>
              RoomFinder
            </h5>
            <p className="text-muted">
              Nền tảng tìm kiếm phòng trọ hàng đầu Việt Nam. Kết nối người thuê và cho thuê một cách nhanh chóng, an
              toàn.
            </p>
            <div className="d-flex">
              <a href="#" className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Về chúng tôi</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Tin tức
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Hỗ trợ</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Báo cáo sự cố
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Pháp lý</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Quy định
                </a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">
                  Cookie
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Tải ứng dụng</h6>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="text-decoration-none">
                <img src="/app-store-badge.png" alt="App Store" className="img-fluid" />
              </a>
              <a href="#" className="text-decoration-none">
                <img src="/google-play-badge.png" alt="Google Play" className="img-fluid" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">© 2024 RoomFinder. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted mb-0">Được phát triển với ❤️ tại Việt Nam</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
