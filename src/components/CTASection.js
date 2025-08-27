const CTASection = () => {
  return (
    <section className="cta-section py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="display-5 fw-bold mb-4">Bắt đầu hành trình tìm phòng trọ ngay hôm nay!</h2>
            <p className="lead mb-4">Tham gia cùng hàng nghìn người đã tìm được phòng trọ ưng ý qua RoomFinder</p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <button className="btn btn-light btn-lg px-5">
                <i className="bi bi-search me-2"></i>
                Tìm phòng ngay
              </button>
              <button className="btn btn-outline-light btn-lg px-5">
                <i className="bi bi-plus-circle me-2"></i>
                Đăng tin cho thuê
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
