"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Search, Filter, MapPin, Star } from "lucide-react"
import { sampleRooms, hanoiDistricts, roomTypes, type Room } from "@/lib/sample-data"

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedRoomType, setSelectedRoomType] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(sampleRooms)
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    handleSearch()
  }, [searchQuery, selectedDistrict, selectedRoomType, priceRange, sortBy])

  const handleSearch = () => {
    let filtered = [...sampleRooms]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (room) =>
          room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by district
    if (selectedDistrict) {
      filtered = filtered.filter((room) => room.location.district === selectedDistrict)
    }

    // Filter by room type
    if (selectedRoomType) {
      filtered = filtered.filter((room) => room.roomType === selectedRoomType)
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter((room) => room.price >= Number.parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter((room) => room.price <= Number.parseInt(priceRange.max))
    }

    // Sort results
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredRooms(filtered)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
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

        {/* Search & Filter Section */}
        <section className="bg-white py-4 border-bottom">
          <div className="container">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm phòng trọ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="">Tất cả quận</option>
                  {hanoiDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                >
                  <option value="">Loại phòng</option>
                  {roomTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Giá từ"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Giá đến"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                />
              </div>
              <div className="col-md-1">
                <button className="btn btn-primary w-100">
                  <Filter size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-4">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 mb-0">Tìm thấy {filteredRooms.length} phòng trọ</h2>
              <select className="form-select w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            <div className="row g-4">
              {filteredRooms.map((room) => (
                <div key={room.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                    <div className="position-relative">
                      <img
                        src={room.images[0] || "/placeholder.svg"}
                        alt={room.title}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <span
                        className={`position-absolute top-0 end-0 m-2 badge ${room.available ? "bg-success" : "bg-danger"}`}
                      >
                        {room.available ? "Còn trống" : "Đã thuê"}
                      </span>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold text-truncate">{room.title}</h5>

                      <div className="d-flex align-items-center text-muted mb-2">
                        <MapPin size={16} className="me-1" />
                        <small>
                          {room.location.district}, {room.location.city}
                        </small>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <Star size={16} className="text-warning me-1" />
                        <span className="fw-semibold">{room.rating}</span>
                        <small className="text-muted ms-1">({room.reviewCount} đánh giá)</small>
                      </div>

                      <p className="card-text text-muted small flex-grow-1">{room.description.substring(0, 100)}...</p>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="text-primary fw-bold h5 mb-0">{formatPrice(room.price)}</div>
                        <small className="text-muted">{room.area}m²</small>
                      </div>

                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="badge bg-light text-dark border">
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="badge bg-light text-dark border">+{room.amenities.length - 3}</span>
                        )}
                      </div>

                      <Link href={`/rooms/${room.id}`} className="btn btn-primary w-100 mt-auto">
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-5">
                <h4 className="text-muted">Không tìm thấy phòng trọ phù hợp</h4>
                <p className="text-muted">Hãy thử thay đổi bộ lọc tìm kiếm</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </>
  )
}
