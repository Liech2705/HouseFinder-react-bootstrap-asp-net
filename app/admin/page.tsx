"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Home, DollarSign, AlertTriangle, TrendingUp, Eye, Settings, Shield, BarChart3 } from "lucide-react"
import { sampleUsers, sampleAdminUsers, sampleRooms, sampleTransactions, sampleReports } from "@/lib/sample-data"
import Link from "next/link"

export default function AdminDashboard() {
  const [currentAdmin] = useState(sampleAdminUsers[0])

  // Calculate statistics
  const totalUsers = sampleUsers.length
  const totalOwners = sampleUsers.filter((user) => user.isOwner).length
  const totalRooms = sampleRooms.length
  const activeRooms = sampleRooms.filter((room) => room.status === "active").length
  const pendingRooms = sampleRooms.filter((room) => room.status === "pending").length
  const totalTransactions = sampleTransactions.length
  const completedTransactions = sampleTransactions.filter((txn) => txn.status === "completed")
  const totalRevenue = completedTransactions.reduce((sum, txn) => sum + txn.amount, 0)
  const pendingReports = sampleReports.filter((report) => report.status === "pending").length
  const suspendedUsers = sampleUsers.filter((user) => user.status === "suspended").length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const recentTransactions = sampleTransactions.slice(0, 5)
  const recentReports = sampleReports.slice(0, 3)
  const recentUsers = sampleUsers.slice(0, 4)

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
              <Badge variant="secondary">Quản trị viên</Badge>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Link href="/admin" className="text-primary font-medium">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Chào mừng, {currentAdmin.name}</h1>
          <p className="text-muted-foreground">
            Tổng quan hệ thống RoomFinder - Cập nhật lúc {new Date().toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {totalOwners} chủ trọ, {totalUsers - totalOwners} người thuê
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phòng trọ</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRooms}</div>
              <p className="text-xs text-muted-foreground">
                {activeRooms} đang hoạt động, {pendingRooms} chờ duyệt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">{completedTransactions.length} giao dịch hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cảnh báo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingReports + suspendedUsers}</div>
              <p className="text-xs text-muted-foreground">
                {pendingReports} báo cáo, {suspendedUsers} tài khoản bị khóa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Giao dịch gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const user = sampleUsers.find((u) => u.id === transaction.userId)
                  const room = sampleRooms.find((r) => r.id === transaction.roomId)
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.type === "deposit"
                              ? "Đặt cọc"
                              : transaction.type === "monthly_rent"
                                ? "Tiền thuê"
                                : "Khác"}{" "}
                            - {room?.title.slice(0, 30)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(transaction.amount)}</p>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                          {transaction.status === "completed"
                            ? "Hoàn thành"
                            : transaction.status === "pending"
                              ? "Đang xử lý"
                              : "Thất bại"}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4">
                <Link href="/admin/transactions">
                  <Button variant="outline" className="w-full bg-transparent">
                    Xem tất cả giao dịch
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Quản lý người dùng
                  </Button>
                </Link>
                <Link href="/admin/content">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    Kiểm duyệt nội dung
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Báo cáo thống kê
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Cấu hình hệ thống
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Báo cáo cần xử lý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report) => {
                    const reporter = sampleUsers.find((u) => u.id === report.reporterId)
                    return (
                      <div key={report.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={report.status === "pending" ? "destructive" : "secondary"}>
                            {report.status === "pending" ? "Chờ xử lý" : "Đang điều tra"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{report.reason}</p>
                        <p className="text-xs text-muted-foreground">Báo cáo bởi: {reporter?.name}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4">
                  <Link href="/admin/content">
                    <Button variant="outline" className="w-full bg-transparent">
                      Xem tất cả báo cáo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Users */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Người dùng mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.isOwner ? "Chủ trọ" : "Người thuê"}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                        {user.status === "active" ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                      {user.verified && <Shield className="h-3 w-3 ml-1 text-green-500" />}
                    </div>
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
