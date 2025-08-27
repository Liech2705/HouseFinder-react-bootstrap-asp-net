"use client"

import { useState } from "react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <a className="navbar-brand fw-bold fs-3" href="#" style={{ color: "var(--primary-blue)" }}>
          <i className="bi bi-house-door me-2"></i>
          RoomFinder
        </a>

        <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#features">
                Tính năng
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">
                Cách hoạt động
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#testimonials">
                Đánh giá
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                Liên hệ
              </a>
            </li>
            <li className="nav-item ms-2">
              <a className="btn btn-outline-custom" href="#login">
                Đăng nhập
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
