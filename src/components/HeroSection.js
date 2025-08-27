"use client"

import { useState } from "react"
import SearchService from "../services/SearchService"

const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    priceRange: "",
    roomType: "",
  })

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const results = await SearchService.searchRooms(searchData)
      console.log("Search results:", results)
      // Handle search results - redirect to results page or show results
    } catch (error) {
      console.error("Search error:", error)
    }
  }

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4">
              Tìm phòng trọ <span style={{ color: "var(--primary-blue)" }}>hoàn hảo</span> dễ dàng
            </h1>
            <p className="lead mb-4 text-muted">
              Tìm kiếm, so sánh và đặt phòng trọ giá rẻ trên khắp Việt Nam. Nhanh chóng, an toàn và tiện lợi.
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 mb-5">
              <button className="btn btn-primary-custom btn-lg">
                <i className="bi bi-search me-2"></i>
                Tìm phòng ngay
              </button>
              <button className="btn btn-outline-custom btn-lg">
                <i className="bi bi-plus-circle me-2"></i>
                Đăng tin cho thuê
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="search-form">
              <h4 className="mb-4">Tìm kiếm phòng trọ</h4>
              <form onSubmit={handleSearch}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Địa điểm</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      name="location"
                      value={searchData.location}
                      onChange={handleInputChange}
                      placeholder="Nhập quận, huyện, thành phố..."
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Khoảng giá</label>
                    <select
                      className="form-select form-control-custom"
                      name="priceRange"
                      value={searchData.priceRange}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn khoảng giá</option>
                      <option value="0-2000000">Dưới 2 triệu</option>
                      <option value="2000000-4000000">2 - 4 triệu</option>
                      <option value="4000000-6000000">4 - 6 triệu</option>
                      <option value="6000000+">Trên 6 triệu</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Loại phòng</label>
                    <select
                      className="form-select form-control-custom"
                      name="roomType"
                      value={searchData.roomType}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn loại phòng</option>
                      <option value="single">Phòng đơn</option>
                      <option value="shared">Phòng chia sẻ</option>
                      <option value="apartment">Căn hộ mini</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary-custom w-100">
                      <i className="bi bi-search me-2"></i>
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
