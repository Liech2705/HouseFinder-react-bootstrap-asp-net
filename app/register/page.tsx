"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Home, Eye, EyeOff, Check } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "tenant", // tenant or landlord
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên là bắt buộc"
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Bạn phải đồng ý với điều khoản sử dụng"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Register data:", formData)
      // Here you would typically call your ASP.NET API
      alert("Đăng ký thành công!")
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Yếu", class: "text-danger" }
      case 2:
        return { text: "Trung bình", class: "text-warning" }
      case 3:
        return { text: "Mạnh", class: "text-info" }
      case 4:
        return { text: "Rất mạnh", class: "text-success" }
      default:
        return { text: "", class: "" }
    }
  }

  const strength = passwordStrength(formData.password)
  const strengthInfo = getPasswordStrengthText(strength)

  return (
    <>
      {/* Bootstrap CSS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div className="min-vh-100 d-flex align-items-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
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
                    <h3 className="fw-bold text-dark">Đăng ký tài khoản</h3>
                    <p className="text-muted">Tạo tài khoản để bắt đầu tìm phòng trọ</p>
                  </div>

                  {/* Register Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="fullName" className="form-label fw-semibold">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg rounded-3 ${errors.fullName ? "is-invalid" : ""}`}
                          id="fullName"
                          name="fullName"
                          placeholder="Nhập họ và tên"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label fw-semibold">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          className={`form-control form-control-lg rounded-3 ${errors.phone ? "is-invalid" : ""}`}
                          id="phone"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        Email *
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
                      <label htmlFor="userType" className="form-label fw-semibold">
                        Loại tài khoản
                      </label>
                      <select
                        className="form-select form-select-lg rounded-3"
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                      >
                        <option value="tenant">Người thuê phòng</option>
                        <option value="landlord">Chủ nhà cho thuê</option>
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">
                          Mật khẩu *
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
                        {formData.password && (
                          <div className="mt-1">
                            <small className={strengthInfo.class}>Độ mạnh: {strengthInfo.text}</small>
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                          Xác nhận mật khẩu *
                        </label>
                        <div className="position-relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={`form-control form-control-lg rounded-3 pe-5 ${errors.confirmPassword ? "is-invalid" : ""}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                          <button
                            type="button"
                            className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <div className="mt-1">
                            <small className="text-success">
                              <Check size={16} className="me-1" />
                              Mật khẩu khớp
                            </small>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${errors.agreeTerms ? "is-invalid" : ""}`}
                          type="checkbox"
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label text-muted" htmlFor="agreeTerms">
                          Tôi đồng ý với{" "}
                          <Link href="/terms" className="text-primary text-decoration-none">
                            Điều khoản sử dụng
                          </Link>{" "}
                          và{" "}
                          <Link href="/privacy" className="text-primary text-decoration-none">
                            Chính sách bảo mật
                          </Link>
                        </label>
                        {errors.agreeTerms && <div className="invalid-feedback d-block">{errors.agreeTerms}</div>}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold mb-3">
                      Đăng ký tài khoản
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="text-center mb-3">
                    <span className="text-muted">hoặc</span>
                  </div>

                  {/* Social Register */}
                  <div className="d-grid gap-2 mb-4">
                    <button className="btn btn-outline-danger btn-lg rounded-3">
                      <i className="fab fa-google me-2"></i>
                      Đăng ký với Google
                    </button>
                    <button className="btn btn-outline-primary btn-lg rounded-3">
                      <i className="fab fa-facebook-f me-2"></i>
                      Đăng ký với Facebook
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <span className="text-muted">Đã có tài khoản? </span>
                    <Link href="/login" className="text-primary text-decoration-none fw-semibold">
                      Đăng nhập ngay
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
