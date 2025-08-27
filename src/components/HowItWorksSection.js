const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Tìm kiếm phòng",
      description: "Nhập địa điểm, khoảng giá và loại phòng bạn mong muốn để tìm kiếm.",
    },
    {
      number: 2,
      title: "Xem chi tiết & đánh giá",
      description: "Xem hình ảnh, thông tin chi tiết và đánh giá từ người thuê trước.",
    },
    {
      number: 3,
      title: "Chat với chủ nhà",
      description: "Liên hệ trực tiếp với chủ nhà để trao đổi thêm thông tin.",
    },
    {
      number: 4,
      title: "Đặt phòng & thanh toán",
      description: "Đặt cọc trực tuyến an toàn và hoàn tất thủ tục thuê phòng.",
    },
  ]

  return (
    <section id="how-it-works" className="py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Cách thức hoạt động</h2>
            <p className="lead text-muted">Chỉ với 4 bước đơn giản, bạn đã có thể tìm được phòng trọ ưng ý</p>
          </div>
        </div>

        <div className="row g-4">
          {steps.map((step, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="step-number">{step.number}</div>
                <h5 className="fw-bold mb-3">{step.title}</h5>
                <p className="text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
