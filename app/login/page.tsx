"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Home, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Login data:", formData)
      // Here you would typically call your ASP.NET API
      alert("Đăng nhập thành công!")
    }
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div className="min-vh-100 d-flex align-items-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <Link href="/" className="text-decoration-none">
                      <div className="d-flex align-items-center justify-content-center mb-3">
                        <Home className="text-primary me-2" size={32} />
                        <h2 className="text-primary fw-bold mb-0">RoomFinder</h2>
                      </div>
                    </Link>
                    <h3 className="fw-bold text-dark">Đăng nhập</h3>
                    <p className="text-muted">Chào mừng bạn trở lại!</p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg rounded-3 ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        name="email"
                        placeholder="Nhập email của bạn"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">
                        Mật khẩu
                      </label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control form-control-lg rounded-3 pe-5 ${errors.password ? "is-invalid" : ""}`}
                          id="password"
                          name="password"
                          placeholder="Nhập mật khẩu"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                          Ghi nhớ đăng nhập
                        </label>
                      </div>
                      <Link href="/forgot-password" className="text-primary text-decoration-none">
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold mb-3">
                      Đăng nhập
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="text-center mb-3">
                    <span className="text-muted">hoặc</span>
                  </div>

                  {/* Social Login */}
                  <div className="d-grid gap-2 mb-4">
                    <button className="btn btn-outline-danger btn-lg rounded-3">
                      <i className="fab fa-google me-2"></i>
                      Đăng nhập với Google
                    </button>
                    <button className="btn btn-outline-primary btn-lg rounded-3">
                      <i className="fab fa-facebook-f me-2"></i>
                      Đăng nhập với Facebook
                    </button>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <span className="text-muted">Chưa có tài khoản? </span>
                    <Link href="/register" className="text-primary text-decoration-none fw-semibold">
                      Đăng ký ngay
                    </Link>
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
