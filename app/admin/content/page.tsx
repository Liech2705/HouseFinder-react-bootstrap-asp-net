"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Flag,
  Trash2,
  Clock,
  User,
  MapPin,
} from "lucide-react"
import {
  sampleRooms,
  sampleReports,
  sampleReviews,
  sampleUsers,
  sampleAdminUsers,
  type Room,
  type Report,
  type Review,
} from "@/lib/sample-data"
import Link from "next/link"

export default function ContentModeration() {
  const [currentAdmin] = useState(sampleAdminUsers[0])
  const [activeTab, setActiveTab] = useState<"rooms" | "reports" | "reviews">("rooms")
  const [rooms, setRooms] = useState<Room[]>(sampleRooms)
  const [reports, setReports] = useState<Report[]>(sampleReports)
  const [reviews, setReviews] = useState<Review[]>(sampleReviews)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const handleApproveRoom = (roomId: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? { ...room, status: "active", moderatedBy: currentAdmin.id, moderatedAt: new Date().toISOString() }
          : room,
      ),
    )
  }

  const handleRejectRoom = (roomId: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? { ...room, status: "rejected", moderatedBy: currentAdmin.id, moderatedAt: new Date().toISOString() }
          : room,
      ),
    )
  }

  const handleSuspendRoom = (roomId: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? { ...room, status: "suspended", moderatedBy: currentAdmin.id, moderatedAt: new Date().toISOString() }
          : room,
      ),
    )
  }

  const handleResolveReport = (reportId: string, action: "resolved" | "dismissed") => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? { ...report, status: action, resolvedBy: currentAdmin.id, resolvedAt: new Date().toISOString() }
          : report,
      ),
    )
  }

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, status: "deleted" } : review)))
  }

  const handleHideReview = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, status: review.status === "hidden" ? "active" : "hidden" } : review,
      ),
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>
      case "suspended":
        return <Badge className="bg-orange-100 text-orange-800">Tạm ngưng</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-red-100 text-red-800">Chờ xử lý</Badge>
      case "investigating":
        return <Badge className="bg-yellow-100 text-yellow-800">Đang điều tra</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Đã giải quyết</Badge>
      case "dismissed":
        return <Badge className="bg-gray-100 text-gray-800">Đã bỏ qua</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  // Filter data based on active tab and filters
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || room.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || report.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || review.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const pendingRooms = rooms.filter((room) => room.status === "pending").length
  const pendingReports = reports.filter((report) => report.status === "pending").length
  const reportedReviews = reviews.filter((review) => review.reportCount > 0).length

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
              <Badge variant="secondary">Kiểm duyệt nội dung</Badge>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Link href="/admin" className="text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-muted-foreground hover:text-primary">
                Quản lý người dùng
              </Link>
              <Link href="/admin/content" className="text-primary font-medium">
                Kiểm duyệt nội dung
              </Link>
              <Link href="/admin/reports" className="text-muted-foreground hover:text-primary">
                Báo cáo & Thống kê
              </Link>
              <Link href="/admin/settings" className="text-muted-foreground hover:text-primary">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kiểm duyệt nội dung</h1>
          <p className="text-muted-foreground">Quản lý và kiểm duyệt tin đăng, xử lý báo cáo vi phạm và đánh giá</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tin đăng chờ duyệt</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingRooms}</div>
              <p className="text-xs text-muted-foreground">Cần xem xét và phê duyệt</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Báo cáo vi phạm</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{pendingReports}</div>
              <p className="text-xs text-muted-foreground">Báo cáo chờ xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đánh giá bị báo cáo</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{reportedReviews}</div>
              <p className="text-xs text-muted-foreground">Đánh giá có nội dung vi phạm</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "rooms" ? "default" : "ghost"}
            onClick={() => setActiveTab("rooms")}
            className="relative"
          >
            Tin đăng phòng trọ
            {pendingRooms > 0 && (
              <Badge className="ml-2 bg-orange-500 text-white text-xs px-1 py-0">{pendingRooms}</Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "ghost"}
            onClick={() => setActiveTab("reports")}
            className="relative"
          >
            Báo cáo vi phạm
            {pendingReports > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1 py-0">{pendingReports}</Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "reviews" ? "default" : "ghost"}
            onClick={() => setActiveTab("reviews")}
            className="relative"
          >
            Đánh giá & Bình luận
            {reportedReviews > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white text-xs px-1 py-0">{reportedReviews}</Badge>
            )}
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                className="w-full p-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                {activeTab === "rooms" && (
                  <>
                    <option value="pending">Chờ duyệt</option>
                    <option value="active">Đã duyệt</option>
                    <option value="rejected">Từ chối</option>
                    <option value="suspended">Tạm ngưng</option>
                  </>
                )}
                {activeTab === "reports" && (
                  <>
                    <option value="pending">Chờ xử lý</option>
                    <option value="investigating">Đang điều tra</option>
                    <option value="resolved">Đã giải quyết</option>
                    <option value="dismissed">Đã bỏ qua</option>
                  </>
                )}
                {activeTab === "reviews" && (
                  <>
                    <option value="active">Hiển thị</option>
                    <option value="hidden">Đã ẩn</option>
                    <option value="deleted">Đã xóa</option>
                  </>
                )}
              </select>

              <Button variant="outline" className="bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Áp dụng bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content based on active tab */}
        {activeTab === "rooms" && (
          <Card>
            <CardHeader>
              <CardTitle>Tin đăng phòng trọ ({filteredRooms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRooms.map((room) => {
                  const owner = sampleUsers.find((u) => u.id === room.owner.id)
                  return (
                    <div key={room.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <img
                        src={room.images[0] || "/placeholder.svg"}
                        alt={room.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{room.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {room.location.address}, {room.location.district}
                              </div>
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {room.owner.name}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{room.description.slice(0, 150)}...</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="font-semibold text-primary">{formatCurrency(room.price)}/tháng</span>
                              <span>{room.area}m²</span>
                              <span>{room.amenities.length} tiện nghi</span>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(room.status)}
                            <p className="text-xs text-muted-foreground mt-1">
                              Đăng: {new Date(room.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                            {room.moderatedAt && (
                              <p className="text-xs text-muted-foreground">
                                Duyệt: {new Date(room.moderatedAt).toLocaleDateString("vi-VN")}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Eye className="h-4 w-4 mr-1" />
                              Xem chi tiết
                            </Button>
                            {room.reportCount > 0 && (
                              <Badge className="bg-red-100 text-red-800">{room.reportCount} báo cáo</Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {room.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveRoom(room.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Duyệt
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectRoom(room.id)}
                                  className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Từ chối
                                </Button>
                              </>
                            )}
                            {room.status === "active" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuspendRoom(room.id)}
                                className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Tạm ngưng
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo vi phạm ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => {
                  const reporter = sampleUsers.find((u) => u.id === report.reporterId)
                  const targetRoom =
                    report.targetType === "room" ? sampleRooms.find((r) => r.id === report.targetId) : null
                  const targetUser =
                    report.targetType === "user" ? sampleUsers.find((u) => u.id === report.targetId) : null

                  return (
                    <div key={report.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{report.reason}</h3>
                            {getReportStatusBadge(report.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Báo cáo bởi: {reporter?.name}</span>
                            <span>
                              Loại:{" "}
                              {report.targetType === "room"
                                ? "Tin đăng"
                                : report.targetType === "user"
                                  ? "Người dùng"
                                  : "Đánh giá"}
                            </span>
                            <span>Ngày: {new Date(report.createdAt).toLocaleDateString("vi-VN")}</span>
                          </div>
                        </div>
                      </div>

                      {targetRoom && (
                        <div className="bg-muted p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium">Tin đăng bị báo cáo:</p>
                          <p className="text-sm">{targetRoom.title}</p>
                        </div>
                      )}

                      {targetUser && (
                        <div className="bg-muted p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium">Người dùng bị báo cáo:</p>
                          <p className="text-sm">
                            {targetUser.name} ({targetUser.email})
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          Xem chi tiết
                        </Button>

                        {report.status === "pending" && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleResolveReport(report.id, "resolved")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Giải quyết
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveReport(report.id, "dismissed")}
                              className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Bỏ qua
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reviews" && (
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá & Bình luận ({filteredReviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReviews.map((review) => {
                  const user = sampleUsers.find((u) => u.id === review.userId)
                  const room = sampleRooms.find((r) => r.id === review.roomId)

                  return (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user?.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{user?.name}</h3>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <Badge
                                variant={
                                  review.status === "active"
                                    ? "default"
                                    : review.status === "hidden"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {review.status === "active"
                                  ? "Hiển thị"
                                  : review.status === "hidden"
                                    ? "Đã ẩn"
                                    : "Đã xóa"}
                              </Badge>
                            </div>
                            <p className="text-sm mb-2">{review.comment}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Phòng: {room?.title.slice(0, 30)}...</span>
                              <span>Ngày: {new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
                              {review.reportCount > 0 && (
                                <Badge className="bg-red-100 text-red-800 text-xs">{review.reportCount} báo cáo</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          Xem chi tiết
                        </Button>

                        <div className="flex items-center space-x-2">
                          {review.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHideReview(review.id)}
                              className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ẩn
                            </Button>
                          )}
                          {review.status === "hidden" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHideReview(review.id)}
                              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Hiển thị
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
