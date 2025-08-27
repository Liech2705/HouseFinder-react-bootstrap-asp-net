"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Home, Search, Filter } from "lucide-react"
import { sampleRooms, sampleTestimonials, roomTypes, hanoiDistricts, type Room } from "@/lib/sample-data"
import Link from "next/link"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedRoomType, setSelectedRoomType] = useState("")
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(sampleRooms)

  const handleSearch = () => {
    let filtered = sampleRooms

    if (searchQuery) {
      filtered = filtered.filter(
        (room) =>
          room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.location.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedDistrict) {
      filtered = filtered.filter((room) => room.location.district === selectedDistrict)
    }

    if (selectedRoomType) {
      filtered = filtered.filter((room) => room.roomType === selectedRoomType)
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">RoomFinder</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-foreground hover:text-primary">
                Trang chủ
              </a>
              <Link href="/rooms" className="text-foreground hover:text-primary">
                Tìm phòng
              </Link>
              <a href="#" className="text-foreground hover:text-primary">
                Đăng tin
              </a>
              <a href="#" className="text-foreground hover:text-primary">
                Liên hệ
              </a>
            </nav>
            <div className="flex space-x-2">
              <a href="/login">
                <Button variant="outline">Đăng nhập</Button>
              </a>
              <a href="/register">
                <Button>Đăng ký</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Tìm phòng trọ lý tưởng của bạn</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Hàng nghìn phòng trọ chất lượng, giá cả phải chăng tại Hà Nội
          </p>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Tìm kiếm theo địa chỉ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {hanoiDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    className="w-full p-2 border rounded-md"
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
                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Room Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Phòng trọ nổi bật ({filteredRooms.length} kết quả)</h3>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={room.images[0] || "/placeholder.svg"}
                    alt={room.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${room.available ? "bg-green-500" : "bg-red-500"}`}>
                    {room.available ? "Còn trống" : "Đã thuê"}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg mb-2 line-clamp-2">{room.title}</h4>

                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {room.location.district}, {room.location.city}
                  </div>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">{room.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">({room.reviewCount} đánh giá)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary">{formatPrice(room.price)}</span>
                    <span className="text-sm text-muted-foreground">{room.area}m²</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {room.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{room.amenities.length - 3} khác
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={room.owner.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{room.owner.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm">{room.owner.name}</span>
                      {room.owner.verified && (
                        <Badge variant="outline" className="ml-1 text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <Link href={`/rooms/${room.id}`}>
                      <Button size="sm">Xem chi tiết</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">Khách hàng nói gì về chúng tôi</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleTestimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{testimonial.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h4 className="font-semibold">{testimonial.user.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.user.location}</p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>

                  <p className="text-sm">{testimonial.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-muted-foreground">Phòng trọ</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Chủ nhà</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2,000+</div>
              <div className="text-muted-foreground">Khách hàng hài lòng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="text-muted-foreground">Quận/Huyện</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">RoomFinder</span>
              </div>
              <p className="text-sm text-muted-foreground">Nền tảng tìm kiếm phòng trọ hàng đầu tại Việt Nam</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Tìm phòng trọ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Đăng tin cho thuê
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Quản lý tin đăng
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Báo cáo sự cố
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@roomfinder.vn</li>
                <li>Hotline: 1900 1234</li>
                <li>Địa chỉ: Hà Nội, Việt Nam</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 RoomFinder. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  )
}
