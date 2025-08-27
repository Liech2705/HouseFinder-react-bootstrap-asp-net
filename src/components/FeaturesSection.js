const FeaturesSection = () => {
  const features = [
    {
      icon: "bi-geo-alt",
      title: "Tìm kiếm trên bản đồ",
      description:
        "Xem vị trí chính xác của phòng trọ trên bản đồ tương tác, dễ dàng đánh giá khoảng cách đến nơi làm việc, học tập.",
    },
    {
      icon: "bi-star",
      title: "Đánh giá & Nhận xét",
      description: "Đọc đánh giá thật từ người thuê trước đó, giúp bạn đưa ra quyết định chính xác nhất.",
    },
    {
      icon: "bi-chat-dots",
      title: "Chat với chủ nhà",
      description: "Liên hệ trực tiếp với chủ nhà qua hệ thống chat tích hợp, trao đổi thông tin nhanh chóng.",
    },
    {
      icon: "bi-shield-check",
      title: "Đặt cọc an toàn",
      description: "Thanh toán đặt cọc trực tuyến an toàn, bảo vệ quyền lợi của cả người thuê và cho thuê.",
    },
  ]

  return (
    <section id="features" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Tại sao chọn RoomFinder?</h2>
            <p className="lead text-muted">
              Chúng tôi cung cấp những tính năng tốt nhất để giúp bạn tìm được phòng trọ ưng ý
            </p>
          </div>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="card-custom h-100 p-4 text-center">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h5 className="fw-bold mb-3">{feature.title}</h5>
                <p className="text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
