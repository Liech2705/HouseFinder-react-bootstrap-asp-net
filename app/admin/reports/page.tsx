"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Calendar, Download, MapPin } from "lucide-react"
import {
  sampleUsers,
  sampleAdminUsers,
  sampleRooms,
  sampleTransactions,
  sampleReports,
  hanoiDistricts,
} from "@/lib/sample-data"
import Link from "next/link"

export default function StatisticsReports() {
  const [currentAdmin] = useState(sampleAdminUsers[0])
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter" | "year">("month")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")

  // Calculate statistics
  const totalUsers = sampleUsers.length
  const totalOwners = sampleUsers.filter((user) => user.isOwner).length
  const totalRenters = totalUsers - totalOwners
  const totalRooms = sampleRooms.length
  const activeRooms = sampleRooms.filter((room) => room.status === "active").length
  const occupiedRooms = sampleRooms.filter((room) => !room.available).length
  const occupancyRate = ((occupiedRooms / totalRooms) * 100).toFixed(1)

  const completedTransactions = sampleTransactions.filter((txn) => txn.status === "completed")
  const totalRevenue = completedTransactions.reduce((sum, txn) => sum + txn.amount, 0)
  const averageRoomPrice = sampleRooms.reduce((sum, room) => sum + room.price, 0) / sampleRooms.length

  const pendingReports = sampleReports.filter((report) => report.status === "pending").length
  const resolvedReports = sampleReports.filter((report) => report.status === "resolved").length

  // Mock data for charts
  const monthlyStats = [
    { month: "T1", users: 45, rooms: 12, revenue: 125000000 },
    { month: "T2", users: 52, rooms: 18, revenue: 145000000 },
    { month: "T3", users: 61, rooms: 25, revenue: 178000000 },
    { month: "T4", users: 58, rooms: 22, revenue: 165000000 },
    { month: "T5", users: 67, rooms: 28, revenue: 195000000 },
    { month: "T6", users: 74, rooms: 35, revenue: 225000000 },
  ]

  const districtStats = hanoiDistricts.slice(0, 8).map((district, index) => ({
    district,
    rooms: Math.floor(Math.random() * 50) + 10,
    averagePrice: Math.floor(Math.random() * 5000000) + 3000000,
    occupancyRate: Math.floor(Math.random() * 40) + 60,
  }))

  const topOwners = sampleUsers
    .filter((user) => user.isOwner)
    .map((owner) => ({
      ...owner,
      totalRooms: Math.floor(Math.random() * 10) + 1,
      totalRevenue: Math.floor(Math.random() * 50000000) + 10000000,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
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
              <Badge variant="secondary">Báo cáo & Thống kê</Badge>
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
              <Link href="/admin/reports" className="text-primary font-medium">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Báo cáo & Thống kê</h1>
            <p className="text-muted-foreground">Theo dõi hiệu suất hệ thống và phân tích dữ liệu kinh doanh</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              className="p-2 border rounded-md"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="quarter">3 tháng qua</option>
              <option value="year">12 tháng qua</option>
            </select>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% so với tháng trước
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.2% so với tháng trước
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giá thuê trung bình</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageRoomPrice)}</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -1.8% so với tháng trước
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{Math.floor(totalUsers * 0.15)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.1% so với tháng trước
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Tăng trưởng theo tháng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyStats.map((stat, index) => (
                  <div key={stat.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 text-sm font-medium">{stat.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 text-sm">
                          <span>{stat.users} người dùng</span>
                          <span>{stat.rooms} phòng mới</span>
                        </div>
                        <div
                          className="h-2 bg-primary rounded-full mt-1"
                          style={{ width: `${(stat.revenue / 250000000) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium">{formatCurrency(stat.revenue)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* District Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Hiệu suất theo quận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {districtStats.slice(0, 6).map((district) => (
                  <div key={district.district} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{district.district}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{district.rooms} phòng</span>
                        <span>{district.occupancyRate}% lấp đầy</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(district.averagePrice)}</div>
                      <div className="text-sm text-muted-foreground">Giá TB</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performing Owners */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Chủ trọ hiệu suất cao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topOwners.map((owner, index) => (
                  <div key={owner.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <Avatar>
                        <AvatarImage src={owner.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{owner.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{owner.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{owner.totalRooms} phòng</span>
                          <span>⭐ {owner.rating}</span>
                          {owner.verified && <Badge className="text-xs">Đã xác minh</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(owner.totalRevenue)}</div>
                      <div className="text-sm text-muted-foreground">Doanh thu</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Tình trạng hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-800">Phòng hoạt động</div>
                  <div className="text-sm text-green-600">
                    {activeRooms}/{totalRooms}
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {((activeRooms / totalRooms) * 100).toFixed(0)}%
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-800">Người dùng hoạt động</div>
                  <div className="text-sm text-blue-600">
                    {sampleUsers.filter((u) => u.status === "active").length}/{totalUsers}
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {((sampleUsers.filter((u) => u.status === "active").length / totalUsers) * 100).toFixed(0)}%
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-medium text-yellow-800">Báo cáo chờ xử lý</div>
                  <div className="text-sm text-yellow-600">{pendingReports} báo cáo</div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{pendingReports}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-purple-800">Giao dịch hoàn thành</div>
                  <div className="text-sm text-purple-600">{completedTransactions.length} giao dịch</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {((completedTransactions.length / sampleTransactions.length) * 100).toFixed(0)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Tóm tắt hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {sampleRooms.filter((r) => r.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Tin đăng được duyệt</div>
                <div className="text-xs text-green-600 mt-1">Hôm nay</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">{completedTransactions.length}</div>
                <div className="text-sm text-muted-foreground">Giao dịch thành công</div>
                <div className="text-xs text-blue-600 mt-1">7 ngày qua</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">{resolvedReports}</div>
                <div className="text-sm text-muted-foreground">Báo cáo đã giải quyết</div>
                <div className="text-xs text-purple-600 mt-1">30 ngày qua</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
