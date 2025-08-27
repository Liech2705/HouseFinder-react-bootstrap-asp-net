"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Home,
  MapPin,
  Star,
  Phone,
  Mail,
  Calendar,
  Users,
  Wifi,
  Car,
  Zap,
  Droplets,
  Shield,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react"
import { sampleRooms, roomTypes } from "@/lib/sample-data"

export default function RoomDetailPage() {
  const params = useParams()
  const roomId = params.id as string
  const room = sampleRooms.find((r) => r.id === roomId)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  if (!room) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2>Không tìm thấy phòng trọ</h2>
          <Link href="/rooms" className="btn btn-primary">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length)
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi size={16} />
      case "điều hòa":
        return <Zap size={16} />
      case "nước nóng":
        return <Droplets size={16} />
      case "bảo vệ 24/7":
        return <Shield size={16} />
      case "chỗ để xe":
        return <Car size={16} />
      default:
        return <span>•</span>
    }
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div className="min-vh-100 bg-light">
        {/* Header */}
        <header className="bg-white shadow-sm border-bottom">
          <div className="container py-3">
            <div className="d-flex align-items-center justify-content-between">
              <Link href="/" className="text-decoration-none">
                <div className="d-flex align-items-center">
                  <Home className="text-primary me-2" size={32} />
                  <h1 className="h3 text-primary fw-bold mb-0">RoomFinder</h1>
                </div>
              </Link>
              <nav className="d-none d-md-flex">
                <Link href="/" className="nav-link me-4">
                  Trang chủ
                </Link>
                <Link href="/rooms" className="nav-link me-4 text-primary fw-semibold">
                  Tìm phòng
                </Link>
                <Link href="#" className="nav-link me-4">
                  Đăng tin
                </Link>
                <Link href="#" className="nav-link me-4">
                  Liên hệ
                </Link>
              </nav>
              <div className="d-flex gap-2">
                <Link href="/login" className="btn btn-outline-primary">
                  Đăng nhập
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="bg-white border-bottom">
          <div className="container py-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/rooms">Tìm phòng</Link>
              </li>
              <li className="breadcrumb-item active">{room.title}</li>
            </ol>
          </div>
        </nav>

        <div className="container py-4">
          <div className="row g-4">
            {/* Image Gallery */}
            <div className="col-lg-8">
              <div className="card border-0 rounded-3 overflow-hidden mb-4">
                <div className="position-relative">
                  <img
                    src={room.images[currentImageIndex] || "/placeholder.svg"}
                    alt={room.title}
                    className="w-100"
                    style={{ height: "400px", objectFit: "cover" }}
                  />

                  {room.images.length > 1 && (
                    <>
                      <button
                        className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle"
                        onClick={prevImage}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle"
                        onClick={nextImage}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-50 text-white p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        {currentImageIndex + 1} / {room.images.length}
                      </span>
                      <button
                        className={`btn btn-sm ${isFavorite ? "btn-danger" : "btn-outline-light"}`}
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <Heart size={16} className={isFavorite ? "fill-current" : ""} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="card border-0 rounded-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h1 className="h3 fw-bold mb-2">{room.title}</h1>
                      <div className="d-flex align-items-center text-muted mb-2">
                        <MapPin size={16} className="me-1" />
                        <span>
                          {room.location.address}, {room.location.district}, {room.location.city}
                        </span>
                      </div>
                    </div>
                    <span className={`badge fs-6 ${room.available ? "bg-success" : "bg-danger"}`}>
                      {room.available ? "Còn trống" : "Đã thuê"}
                    </span>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <Star size={20} className="text-warning me-1" />
                    <span className="fw-bold me-2">{room.rating}</span>
                    <span className="text-muted">({room.reviewCount} đánh giá)</span>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-3">
                      <div className="text-center p-3 bg-light rounded-3">
                        <div className="fw-bold text-primary">{room.area}m²</div>
                        <small className="text-muted">Diện tích</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-3 bg-light rounded-3">
                        <div className="fw-bold text-primary">{formatPrice(room.price)}</div>
                        <small className="text-muted">Giá thuê/tháng</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-3 bg-light rounded-3">
                        <div className="fw-bold text-primary">
                          <Users size={16} className="me-1" />
                          {room.maxOccupants}
                        </div>
                        <small className="text-muted">Số người tối đa</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-3 bg-light rounded-3">
                        <div className="fw-bold text-primary">
                          <Calendar size={16} className="me-1" />
                          Ngay
                        </div>
                        <small className="text-muted">Có thể vào ở</small>
                      </div>
                    </div>
                  </div>

                  <h4 className="fw-bold mb-3">Mô tả</h4>
                  <p className="text-muted mb-4">{room.description}</p>

                  <h4 className="fw-bold mb-3">Tiện nghi</h4>
                  <div className="row g-2 mb-4">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-center p-2 bg-light rounded-2">
                          {getAmenityIcon(amenity)}
                          <span className="ms-2">{amenity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Sidebar */}
            <div className="col-lg-4">
              <div className="card border-0 rounded-3 sticky-top" style={{ top: "20px" }}>
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <img
                      src={room.owner.avatar || "/placeholder.svg"}
                      alt={room.owner.name}
                      className="rounded-circle mb-3"
                      width="80"
                      height="80"
                      style={{ objectFit: "cover" }}
                    />
                    <h5 className="fw-bold mb-1">{room.owner.name}</h5>
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="text-muted me-2">Chủ nhà</span>
                      {room.owner.verified && <span className="badge bg-success">✓ Đã xác thực</span>}
                    </div>
                  </div>

                  <div className="d-grid gap-2 mb-4">
                    <button className="btn btn-primary btn-lg" onClick={() => setShowContactForm(!showContactForm)}>
                      <Mail size={16} className="me-2" />
                      Liên hệ ngay
                    </button>
                    <a href={`tel:${room.owner.phone}`} className="btn btn-outline-primary">
                      <Phone size={16} className="me-2" />
                      {room.owner.phone}
                    </a>
                  </div>

                  {showContactForm && (
                    <div className="border-top pt-4">
                      <h6 className="fw-bold mb-3">Gửi tin nhắn</h6>
                      <form>
                        <div className="mb-3">
                          <input type="text" className="form-control" placeholder="Họ tên" />
                        </div>
                        <div className="mb-3">
                          <input type="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="mb-3">
                          <input type="tel" className="form-control" placeholder="Số điện thoại" />
                        </div>
                        <div className="mb-3">
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Tin nhắn..."
                            defaultValue={`Tôi quan tâm đến phòng "${room.title}". Xin vui lòng liên hệ với tôi.`}
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          Gửi tin nhắn
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="border-top pt-4 mt-4">
                    <h6 className="fw-bold mb-3">Thông tin bổ sung</h6>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">• Tiền cọc: {formatPrice(room.deposit)}</li>
                      <li className="mb-2">• Loại phòng: {roomTypes.find((t) => t.value === room.roomType)?.label}</li>
                      <li className="mb-2">• Đăng tin: {new Date(room.createdAt).toLocaleDateString("vi-VN")}</li>
                      <li className="mb-2">• Mã tin: #{room.id}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </>
  )
}
