const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Sinh viên ĐH Bách Khoa",
      rating: 5,
      comment: "Tìm được phòng trọ gần trường chỉ trong 2 ngày. Giao diện dễ sử dụng, thông tin chi tiết và chính xác.",
      avatar: "/young-vietnamese-female-student.png",
    },
    {
      name: "Trần Văn Hùng",
      role: "Nhân viên IT",
      rating: 5,
      comment:
        "Hệ thống chat rất tiện lợi, có thể trao đổi trực tiếp với chủ nhà. Đặt cọc online an toàn và nhanh chóng.",
      avatar: "/young-vietnamese-male-professional.png",
    },
    {
      name: "Lê Thị Mai",
      role: "Nhân viên văn phòng",
      rating: 4,
      comment: "Đánh giá từ người thuê trước rất hữu ích. Giúp tôi tránh được những phòng trọ không phù hợp.",
      avatar: "/young-vietnamese-female-office-worker.png",
    },
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i key={index} className={`bi ${index < rating ? "bi-star-fill" : "bi-star"} rating-stars`}></i>
    ))
  }

  return (
    <section id="testimonials" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Khách hàng nói gì về chúng tôi</h2>
            <p className="lead text-muted">Hàng nghìn người đã tìm được phòng trọ ưng ý qua RoomFinder</p>
          </div>
        </div>

        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="testimonial-card">
                <div className="mb-3">{renderStars(testimonial.rating)}</div>
                <p className="mb-4 fst-italic">"{testimonial.comment}"</p>
                <div className="d-flex align-items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div>
                    <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
                    <small className="text-muted">{testimonial.role}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
