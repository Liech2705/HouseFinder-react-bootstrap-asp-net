"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Home,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Ban,
  Unlock,
  Eye,
  Mail,
  Phone,
  Calendar,
} from "lucide-react"
import { sampleUsers, sampleAdminUsers, type User } from "@/lib/sample-data"
import Link from "next/link"

export default function UserManagement() {
  const [currentAdmin] = useState(sampleAdminUsers[0])
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSuspendUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "suspended" ? "active" : "suspended" } : user,
      ),
    )
  }

  const handleVerifyUser = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, verified: !user.verified } : user)))
  }

  const handleBanUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "banned" ? "active" : "banned" } : user,
      ),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">Tạm khóa</Badge>
      case "banned":
        return <Badge className="bg-red-100 text-red-800">Cấm vĩnh viễn</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getRoleBadge = (role: string, isOwner: boolean) => {
    if (role === "admin" || role === "super_admin") {
      return <Badge className="bg-purple-100 text-purple-800">Quản trị viên</Badge>
    }
    return isOwner ? (
      <Badge className="bg-blue-100 text-blue-800">Chủ trọ</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Người thuê</Badge>
    )
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
              <Badge variant="secondary">Quản lý người dùng</Badge>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Link href="/admin" className="text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-primary font-medium">
                Quản lý người dùng
              </Link>
              <Link href="/admin/content" className="text-muted-foreground hover:text-primary">
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
          <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản người thuê và chủ trọ, phân quyền và kiểm soát truy cập
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chủ trọ</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.isOwner).length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter((u) => u.isOwner && u.verified).length} đã xác minh
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tài khoản bị khóa</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {users.filter((u) => u.status === "suspended" || u.status === "banned").length}
              </div>
              <p className="text-xs text-muted-foreground">Cần xem xét</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chưa xác minh</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{users.filter((u) => !u.verified).length}</div>
              <p className="text-xs text-muted-foreground">Cần xác minh danh tính</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Tìm kiếm và lọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, email, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                className="w-full p-2 border rounded-md"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="user">Người thuê</option>
                <option value="owner">Chủ trọ</option>
                <option value="admin">Quản trị viên</option>
              </select>

              <select
                className="w-full p-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="suspended">Tạm khóa</option>
                <option value="banned">Cấm vĩnh viễn</option>
              </select>

              <Button variant="outline" className="bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Áp dụng bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.verified && <ShieldCheck className="h-4 w-4 text-green-500" />}
                        {getRoleBadge(user.role, user.isOwner)}
                        {getStatusBadge(user.status)}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Tham gia: {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>

                      {user.lastLogin && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Đăng nhập cuối: {new Date(user.lastLogin).toLocaleString("vi-VN")}
                        </p>
                      )}

                      {user.isOwner && (
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>Phòng: {user.totalRooms || 0}</span>
                          <span>Booking: {user.totalBookings || 0}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Button>

                    {!user.verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyUser(user.id)}
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <ShieldCheck className="h-4 w-4 mr-1" />
                        Xác minh
                      </Button>
                    )}

                    {user.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                        className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Khóa tạm thời
                      </Button>
                    ) : user.status === "suspended" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <Unlock className="h-4 w-4 mr-1" />
                        Mở khóa
                      </Button>
                    ) : null}

                    {user.status !== "banned" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBanUser(user.id)}
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Cấm vĩnh viễn
                      </Button>
                    )}

                    <Button variant="outline" size="sm" className="bg-transparent">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Không tìm thấy người dùng</h3>
                <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
