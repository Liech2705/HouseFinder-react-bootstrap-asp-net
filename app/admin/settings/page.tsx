"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  CreditCard,
  Upload,
  Shield,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { sampleSystemConfig, sampleAdminUsers, type SystemConfig } from "@/lib/sample-data"
import Link from "next/link"

export default function SystemConfiguration() {
  const [currentAdmin] = useState(sampleAdminUsers[1]) // Super admin
  const [configs, setConfigs] = useState<SystemConfig[]>(sampleSystemConfig)
  const [activeTab, setActiveTab] = useState<"payment" | "upload" | "security" | "general">("payment")
  const [hasChanges, setHasChanges] = useState(false)

  const handleConfigChange = (configId: string, newValue: string | number | boolean) => {
    setConfigs(
      configs.map((config) =>
        config.id === configId
          ? { ...config, value: newValue, updatedBy: currentAdmin.id, updatedAt: new Date().toISOString() }
          : config,
      ),
    )
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    setHasChanges(false)
    // Show success message
  }

  const handleResetToDefaults = () => {
    // Reset to default values
    setConfigs(sampleSystemConfig)
    setHasChanges(false)
  }

  const getConfigsByCategory = (category: string) => {
    return configs.filter((config) => config.category === category)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">RoomFinder Admin</span>
              </Link>
              <Badge variant="secondary">Cấu hình hệ thống</Badge>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Link href="/admin" className="text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-muted-foreground hover:text-primary">
                Quản lý người dùng
              </Link>
              <Link href="/admin/content" className="text-muted-foreground hover:text-primary">
                Kiểm duyệt nội dung
              </Link>
              <Link href="/admin/reports" className="text-muted-foreground hover:text-primary">
                Báo cáo & Thống kê
              </Link>
              <Link href="/admin/settings" className="text-primary font-medium">
                Cấu hình hệ thống
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={currentAdmin.avatar || "/placeholder.svg"} />
                <AvatarFallback>{currentAdmin.name[0]}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentAdmin.name}</p>
                <p className="text-xs text-muted-foreground">{currentAdmin.department}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cấu hình hệ thống</h1>
            <p className="text-muted-foreground">
              Quản lý cài đặt thanh toán, tải lên, bảo mật và các tùy chọn hệ thống khác
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {hasChanges && (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600">Có thay đổi chưa lưu</span>
              </div>
            )}
            <Button variant="outline" onClick={handleResetToDefaults} className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Khôi phục mặc định
            </Button>
            <Button onClick={handleSaveChanges} disabled={!hasChanges} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "payment" ? "default" : "ghost"}
            onClick={() => setActiveTab("payment")}
            className="flex items-center"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Thanh toán
          </Button>
          <Button
            variant={activeTab === "upload" ? "default" : "ghost"}
            onClick={() => setActiveTab("upload")}
            className="flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Tải lên
          </Button>
          <Button
            variant={activeTab === "security" ? "default" : "ghost"}
            onClick={() => setActiveTab("security")}
            className="flex items-center"
          >
            <Shield className="h-4 w-4 mr-2" />
            Bảo mật
          </Button>
          <Button
            variant={activeTab === "general" ? "default" : "ghost"}
            onClick={() => setActiveTab("general")}
            className="flex items-center"
          >
            <Globe className="h-4 w-4 mr-2" />
            Chung
          </Button>
        </div>

        {/* Payment Settings */}
        {activeTab === "payment" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Cấu hình thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cổng thanh toán mặc định</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={configs.find((c) => c.key === "payment_gateway")?.value as string}
                      onChange={(e) =>
                        handleConfigChange(configs.find((c) => c.key === "payment_gateway")?.id || "", e.target.value)
                      }
                    >
                      <option value="vnpay">VNPay</option>
                      <option value="momo">MoMo</option>
                      <option value="zalopay">ZaloPay</option>
                      <option value="banking">Chuyển khoản ngân hàng</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cổng thanh toán được sử dụng mặc định cho các giao dịch
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phí giao dịch (%)</label>
                    <Input type="number" step="0.1" min="0" max="10" defaultValue="2.5" placeholder="2.5" />
                    <p className="text-xs text-muted-foreground mt-1">Phí giao dịch tính theo phần trăm</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Số tiền giao dịch tối thiểu (VND)</label>
                    <Input type="number" min="0" defaultValue="10000" placeholder="10,000" />
                    <p className="text-xs text-muted-foreground mt-1">Số tiền tối thiểu cho một giao dịch</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số tiền giao dịch tối đa (VND)</label>
                    <Input type="number" min="0" defaultValue="100000000" placeholder="100,000,000" />
                    <p className="text-xs text-muted-foreground mt-1">Số tiền tối đa cho một giao dịch</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="auto_refund" defaultChecked={true} className="rounded border-gray-300" />
                  <label htmlFor="auto_refund" className="text-sm font-medium">
                    Tự động hoàn tiền khi hủy booking
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin ngân hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tên ngân hàng</label>
                    <Input defaultValue="Vietcombank" placeholder="Tên ngân hàng" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số tài khoản</label>
                    <Input defaultValue="1234567890" placeholder="Số tài khoản" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tên chủ tài khoản</label>
                  <Input defaultValue="CONG TY ROOMFINDER" placeholder="Tên chủ tài khoản" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Settings */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Cấu hình tải lên
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Kích thước ảnh tối đa</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={Math.round(
                          ((configs.find((c) => c.key === "max_image_size")?.value as number) || 5242880) / 1024 / 1024,
                        )}
                        onChange={(e) =>
                          handleConfigChange(
                            configs.find((c) => c.key === "max_image_size")?.id || "",
                            Number.parseInt(e.target.value) * 1024 * 1024,
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">MB</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hiện tại:{" "}
                      {formatBytes((configs.find((c) => c.key === "max_image_size")?.value as number) || 5242880)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số ảnh tối đa mỗi tin đăng</label>
                    <Input type="number" min="1" max="20" defaultValue="10" />
                    <p className="text-xs text-muted-foreground mt-1">Số lượng ảnh tối đa cho một tin đăng</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Định dạng ảnh được phép</label>
                    <div className="space-y-2">
                      {["JPEG", "PNG", "WebP", "GIF"].map((format) => (
                        <div key={format} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={format}
                            defaultChecked={format !== "GIF"}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={format} className="text-sm">
                            {format}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Chất lượng nén ảnh (%)</label>
                    <Input type="number" min="10" max="100" defaultValue="85" />
                    <p className="text-xs text-muted-foreground mt-1">Chất lượng ảnh sau khi nén (10-100%)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="auto_resize" defaultChecked={true} className="rounded border-gray-300" />
                  <label htmlFor="auto_resize" className="text-sm font-medium">
                    Tự động thay đổi kích thước ảnh
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="watermark" defaultChecked={false} className="rounded border-gray-300" />
                  <label htmlFor="watermark" className="text-sm font-medium">
                    Thêm watermark vào ảnh
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Cấu hình bảo mật
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Thời gian khóa tài khoản (phút)</label>
                    <Input type="number" min="5" max="1440" defaultValue="30" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Thời gian khóa tài khoản sau khi đăng nhập sai nhiều lần
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số lần đăng nhập sai tối đa</label>
                    <Input type="number" min="3" max="10" defaultValue="5" />
                    <p className="text-xs text-muted-foreground mt-1">Số lần đăng nhập sai trước khi khóa tài khoản</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Tự động duyệt tin từ chủ trọ đã xác minh</h4>
                      <p className="text-sm text-muted-foreground">
                        Tin đăng từ chủ trọ đã xác minh sẽ được duyệt tự động
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="auto_approve"
                        checked={
                          (configs.find((c) => c.key === "auto_approve_verified_owners")?.value as boolean) || false
                        }
                        onChange={(e) =>
                          handleConfigChange(
                            configs.find((c) => c.key === "auto_approve_verified_owners")?.id || "",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300"
                      />
                      <CheckCircle
                        className={`h-4 w-4 ${
                          configs.find((c) => c.key === "auto_approve_verified_owners")?.value
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Yêu cầu xác minh số điện thoại</h4>
                      <p className="text-sm text-muted-foreground">Bắt buộc xác minh số điện thoại khi đăng ký</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require_phone"
                        defaultChecked={true}
                        className="rounded border-gray-300"
                      />
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Bật xác thực 2 bước cho admin</h4>
                      <p className="text-sm text-muted-foreground">Yêu cầu xác thực 2 bước cho tài khoản quản trị</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="admin_2fa" defaultChecked={true} className="rounded border-gray-300" />
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cấu hình spam và lạm dụng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Số tin đăng tối đa mỗi ngày</label>
                    <Input type="number" min="1" max="50" defaultValue="5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số báo cáo để tự động ẩn nội dung</label>
                    <Input type="number" min="1" max="20" defaultValue="3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* General Settings */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Cấu hình chung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tên website</label>
                    <Input defaultValue="RoomFinder" placeholder="Tên website" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email liên hệ</label>
                    <Input defaultValue="support@roomfinder.vn" placeholder="Email liên hệ" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại hotline</label>
                    <Input defaultValue="1900 1234" placeholder="Số điện thoại" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Múi giờ</label>
                    <select className="w-full p-2 border rounded-md" defaultValue="Asia/Ho_Chi_Minh">
                      <option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</option>
                      <option value="Asia/Bangkok">Bangkok (UTC+7)</option>
                      <option value="Asia/Singapore">Singapore (UTC+8)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mô tả website</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    defaultValue="Nền tảng tìm kiếm phòng trọ hàng đầu tại Việt Nam"
                    placeholder="Mô tả website"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngôn ngữ mặc định</label>
                    <select className="w-full p-2 border rounded-md" defaultValue="vi">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Đơn vị tiền tệ</label>
                    <select className="w-full p-2 border rounded-md" defaultValue="VND">
                      <option value="VND">VND (Việt Nam Đồng)</option>
                      <option value="USD">USD (US Dollar)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cấu hình SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meta title</label>
                  <Input defaultValue="RoomFinder - Tìm phòng trọ lý tưởng tại Việt Nam" placeholder="Meta title" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Meta description</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    defaultValue="Tìm kiếm phòng trọ chất lượng, giá cả phải chăng tại Hà Nội và các thành phố lớn. Hàng nghìn lựa chọn từ các chủ trọ uy tín."
                    placeholder="Meta description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Keywords</label>
                  <Input
                    defaultValue="phòng trọ, cho thuê phòng, tìm phòng, Hà Nội, TP.HCM"
                    placeholder="Keywords (phân cách bằng dấu phẩy)"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông báo và email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Gửi email chào mừng</h4>
                    <p className="text-sm text-muted-foreground">Gửi email chào mừng khi người dùng đăng ký</p>
                  </div>
                  <input type="checkbox" defaultChecked={true} className="rounded border-gray-300" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Thông báo tin đăng mới</h4>
                    <p className="text-sm text-muted-foreground">Thông báo cho admin khi có tin đăng mới</p>
                  </div>
                  <input type="checkbox" defaultChecked={true} className="rounded border-gray-300" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Báo cáo hàng tuần</h4>
                    <p className="text-sm text-muted-foreground">Gửi báo cáo thống kê hàng tuần cho admin</p>
                  </div>
                  <input type="checkbox" defaultChecked={false} className="rounded border-gray-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuration History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Lịch sử thay đổi gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {configs.slice(0, 5).map((config) => (
                <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{config.description}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Giá trị: {String(config.value)}</span>
                      <span>Danh mục: {config.category}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Cập nhật: {new Date(config.updatedAt).toLocaleDateString("vi-VN")}</div>
                    <div>Bởi: {sampleAdminUsers.find((a) => a.id === config.updatedBy)?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
