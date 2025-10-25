const WhyChooseUs = () => {
    const features = [
        {
            icon: 'bi-search',
            title: 'Tìm kiếm thông minh',
            description: 'Bộ lọc chuyên sâu giúp bạn tìm được phòng trọ phù hợp nhất với nhu cầu và ngân sách'
        },
        {
            icon: 'bi-geo-alt',
            title: 'Bản đồ tích hợp',
            description: 'Xem vị trí chính xác của phòng trọ trên bản đồ, đánh giá khoảng cách đến các địa điểm quan trọng'
        },
        {
            icon: 'bi-shield-check',
            title: 'Thông tin đáng tin cậy',
            description: 'Tất cả thông tin phòng trọ được kiểm duyệt kỹ lưỡng, đảm bảo chính xác và cập nhật'
        },
        {
            icon: 'bi-telephone',
            title: 'Liên hệ trực tiếp',
            description: 'Kết nối trực tiếp với chủ trọ, trao đổi nhanh chóng và thuận tiện'
        },
        {
            icon: 'bi-clock',
            title: 'Hỗ trợ 24/7',
            description: 'Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn'
        },
        {
            icon: 'bi-currency-dollar',
            title: 'Miễn phí sử dụng',
            description: 'Hoàn toàn miễn phí cho người tìm trọ, không có phí ẩn hay chi phí phát sinh'
        }
    ];

    return (
        <section className="py-5 why-choose-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center mb-5">
                        <h2 className="h4 fw-bold text-dark mb-3">
                            Tại Sao Chọn Chúng Tôi?
                        </h2>
                        <p className="text-muted lead">
                            Chúng tôi cam kết mang đến trải nghiệm tìm kiếm phòng trọ tốt nhất cho người dân Cần Thơ
                        </p>
                    </div>
                </div>

                <div className="row g-2">
                    {features.map((feature, index) => (
                        <div key={index} className="col-lg-4 col-md-6">
                            <div className="feature-card text-center h-100">
                                <div className="feature-icon mb-3">
                                    <i className={`${feature.icon} fs-1 text-white`}></i>
                                </div>
                                <h4 className="h5 fw-bold text-dark mb-3">
                                    {feature.title}
                                </h4>
                                <p className="text-muted">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
