// Sample data for Room Rental Finder application

export interface Room {
  id: string
  title: string
  description: string
  price: number
  deposit: number
  maxOccupants: number
  location: {
    address: string
    district: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  images: string[]
  amenities: string[]
  roomType: "single" | "shared" | "studio" | "apartment"
  area: number // m²
  available: boolean
  availableFrom: string
  owner: {
    id: string
    name: string
    avatar: string
    phone: string
    verified: boolean
  }
  rating: number
  reviewCount: number
  createdAt: string
  status: "active" | "pending" | "rejected" | "suspended"
  moderatedBy?: string
  moderatedAt?: string
  reportCount: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  verified: boolean
  joinedAt: string
  isOwner: boolean
  role: "user" | "owner" | "admin" | "super_admin"
  status: "active" | "suspended" | "banned"
  lastLogin?: string
  totalRooms?: number
  totalBookings?: number
}

export interface AdminUser extends User {
  role: "admin" | "super_admin"
  permissions: string[]
  department: string
}

export interface Transaction {
  id: string
  userId: string
  roomId: string
  amount: number
  type: "booking" | "deposit" | "monthly_rent" | "refund"
  status: "pending" | "completed" | "failed" | "cancelled"
  createdAt: string
  completedAt?: string
}

export interface Report {
  id: string
  reporterId: string
  targetType: "room" | "user" | "review"
  targetId: string
  reason: string
  description: string
  status: "pending" | "investigating" | "resolved" | "dismissed"
  createdAt: string
  resolvedBy?: string
  resolvedAt?: string
}

export interface Review {
  id: string
  userId: string
  roomId: string
  rating: number
  comment: string
  createdAt: string
  status: "active" | "hidden" | "deleted"
  reportCount: number
}

export interface SystemConfig {
  id: string
  key: string
  value: string | number | boolean
  description: string
  category: "payment" | "upload" | "security" | "general"
  updatedBy: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  user: {
    name: string
    avatar: string
    location: string
  }
  rating: number
  comment: string
  date: string
}

export interface SearchFilters {
  location: string
  priceRange: {
    min: number
    max: number
  }
  roomType: string
  amenities: string[]
}

export const sampleRooms: Room[] = [
  {
    id: "1",
    title: "Phòng trọ cao cấp gần Đại học Bách Khoa",
    description:
      "Phòng trọ mới xây, đầy đủ tiện nghi, gần trường học và khu vực ăn uống sầm uất. Phòng có ban công, thoáng mát, an ninh tốt.",
    price: 4500000,
    deposit: 4500000,
    maxOccupants: 2,
    location: {
      address: "123 Đường Lê Thanh Nghị",
      district: "Hai Bà Trưng",
      city: "Hà Nội",
      coordinates: {
        lat: 21.0285,
        lng: 105.8542,
      },
    },
    images: ["/modern-room-interior.png", "/bedroom-with-balcony.png", "/modern-bathroom-interior.png"],
    amenities: ["WiFi miễn phí", "Điều hòa", "Tủ lạnh", "Máy giặt", "Ban công", "Bảo vệ 24/7"],
    roomType: "single",
    area: 25,
    available: true,
    availableFrom: "2024-02-01",
    owner: {
      id: "owner1",
      name: "Chị Lan Anh",
      avatar: "/vietnamese-woman.png",
      phone: "0987654321",
      verified: true,
    },
    rating: 4.8,
    reviewCount: 24,
    createdAt: "2024-01-15",
    status: "active",
    moderatedBy: "admin1",
    moderatedAt: "2024-01-16",
    reportCount: 0,
  },
  {
    id: "2",
    title: "Studio hiện đại tại Cầu Giấy",
    description:
      "Studio đầy đủ nội thất, thiết kế hiện đại, gần các trung tâm thương mại và văn phòng. Thích hợp cho sinh viên và nhân viên văn phòng.",
    price: 6800000,
    deposit: 6800000,
    maxOccupants: 2,
    location: {
      address: "456 Đường Xuân Thủy",
      district: "Cầu Giấy",
      city: "Hà Nội",
      coordinates: {
        lat: 21.0378,
        lng: 105.7804,
      },
    },
    images: ["/modern-studio-apartment.png", "/kitchen-area.png", "/living-space.png"],
    amenities: ["WiFi miễn phí", "Điều hòa", "Tủ lạnh", "Bếp từ", "Máy giặt", "Thang máy"],
    roomType: "studio",
    area: 35,
    available: true,
    availableFrom: "2024-02-15",
    owner: {
      id: "owner2",
      name: "Anh Minh Tuấn",
      avatar: "/vietnamese-man.png",
      phone: "0912345678",
      verified: true,
    },
    rating: 4.6,
    reviewCount: 18,
    createdAt: "2024-01-10",
    status: "active",
    moderatedBy: "admin1",
    moderatedAt: "2024-01-11",
    reportCount: 0,
  },
  {
    id: "3",
    title: "Phòng chia sẻ giá rẻ tại Đống Đa",
    description: "Phòng chia sẻ với 2 giường, phù hợp cho sinh viên. Khu vực yên tĩnh, gần trường học và siêu thị.",
    price: 2200000,
    deposit: 2200000,
    maxOccupants: 2,
    location: {
      address: "789 Đường Thái Thịnh",
      district: "Đống Đa",
      city: "Hà Nội",
      coordinates: {
        lat: 21.0227,
        lng: 105.8194,
      },
    },
    images: ["/shared-bedroom.png", "/study-desk.png", "/shared-bathroom.png"],
    amenities: ["WiFi miễn phí", "Điều hòa", "Tủ lạnh chung", "Bàn học"],
    roomType: "shared",
    area: 20,
    available: true,
    availableFrom: "2024-01-25",
    owner: {
      id: "owner3",
      name: "Cô Hương",
      avatar: "/middle-aged-vietnamese-woman.png",
      phone: "0923456789",
      verified: false,
    },
    rating: 4.2,
    reviewCount: 12,
    createdAt: "2024-01-08",
    status: "pending",
    reportCount: 1,
  },
  {
    id: "4",
    title: "Căn hộ mini 1 phòng ngủ tại Thanh Xuân",
    description: "Căn hộ mini đầy đủ tiện nghi, có phòng khách riêng biệt, thích hợp cho cặp đôi hoặc gia đình nhỏ.",
    price: 8500000,
    deposit: 17000000,
    maxOccupants: 3,
    location: {
      address: "321 Đường Nguyễn Trãi",
      district: "Thanh Xuân",
      city: "Hà Nội",
      coordinates: {
        lat: 20.9967,
        lng: 105.8045,
      },
    },
    images: ["/mini-apartment-living-room.png", "/separate-bedroom.png", "/modern-kitchen.png"],
    amenities: ["WiFi miễn phí", "Điều hòa", "Tủ lạnh", "Máy giặt", "Bếp từ", "Sofa", "TV"],
    roomType: "apartment",
    area: 45,
    available: false,
    availableFrom: "2024-03-01",
    owner: {
      id: "owner4",
      name: "Anh Đức",
      avatar: "/young-vietnamese-man.png",
      phone: "0934567890",
      verified: true,
    },
    rating: 4.9,
    reviewCount: 31,
    createdAt: "2024-01-05",
    status: "active",
    moderatedBy: "admin2",
    moderatedAt: "2024-01-06",
    reportCount: 0,
  },
  {
    id: "5",
    title: "Phòng trọ gần Metro Cát Linh - Hà Đông",
    description:
      "Phòng trọ tiện lợi, gần ga Metro, dễ dàng di chuyển khắp thành phố. Khu vực an ninh, nhiều tiện ích xung quanh.",
    price: 3800000,
    deposit: 3800000,
    maxOccupants: 1,
    location: {
      address: "654 Đường Cát Linh",
      district: "Đống Đa",
      city: "Hà Nội",
      coordinates: {
        lat: 21.0314,
        lng: 105.8244,
      },
    },
    images: ["/cozy-room-near-metro.png", "/wardrobe-and-desk.png", "/window-view.png"],
    amenities: ["WiFi miễn phí", "Điều hòa", "Tủ quần áo", "Bàn học", "Gần Metro"],
    roomType: "single",
    area: 22,
    available: true,
    availableFrom: "2024-02-10",
    owner: {
      id: "owner5",
      name: "Chị Mai",
      avatar: "/friendly-vietnamese-woman.png",
      phone: "0945678901",
      verified: true,
    },
    rating: 4.4,
    reviewCount: 16,
    createdAt: "2024-01-12",
    status: "active",
    moderatedBy: "admin1",
    moderatedAt: "2024-01-13",
    reportCount: 0,
  },
]

export const sampleUsers: User[] = [
  {
    id: "user1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone: "0987123456",
    avatar: "/young-vietnamese-student.png",
    verified: true,
    joinedAt: "2023-09-15",
    isOwner: false,
    role: "user",
    status: "active",
    lastLogin: "2024-01-20",
    totalBookings: 3,
  },
  {
    id: "user2",
    name: "Trần Thị Bình",
    email: "binh.tran@email.com",
    phone: "0912987654",
    avatar: "/vietnamese-office-worker.png",
    verified: true,
    joinedAt: "2023-11-20",
    isOwner: false,
    role: "user",
    status: "active",
    lastLogin: "2024-01-19",
    totalBookings: 1,
  },
  {
    id: "owner1",
    name: "Chị Lan Anh",
    email: "lananh@email.com",
    phone: "0987654321",
    avatar: "/vietnamese-woman.png",
    verified: true,
    joinedAt: "2023-05-10",
    isOwner: true,
    role: "owner",
    status: "active",
    lastLogin: "2024-01-21",
    totalRooms: 3,
    totalBookings: 12,
  },
  {
    id: "owner2",
    name: "Anh Minh Tuấn",
    email: "minhtuan@email.com",
    phone: "0912345678",
    avatar: "/vietnamese-man.png",
    verified: true,
    joinedAt: "2023-07-15",
    isOwner: true,
    role: "owner",
    status: "active",
    lastLogin: "2024-01-20",
    totalRooms: 2,
    totalBookings: 8,
  },
  {
    id: "owner3",
    name: "Cô Hương",
    email: "huong@email.com",
    phone: "0923456789",
    avatar: "/middle-aged-vietnamese-woman.png",
    verified: false,
    joinedAt: "2023-12-01",
    isOwner: true,
    role: "owner",
    status: "suspended",
    lastLogin: "2024-01-18",
    totalRooms: 1,
    totalBookings: 2,
  },
]

export const sampleAdminUsers: AdminUser[] = [
  {
    id: "admin1",
    name: "Nguyễn Quản Trị",
    email: "admin@roomfinder.vn",
    phone: "0900000001",
    avatar: "/admin-avatar-1.png",
    verified: true,
    joinedAt: "2023-01-01",
    isOwner: false,
    role: "admin",
    status: "active",
    lastLogin: "2024-01-21",
    permissions: ["manage_users", "moderate_content", "view_reports", "manage_transactions"],
    department: "Content Moderation",
  },
  {
    id: "admin2",
    name: "Trần Siêu Quản Trị",
    email: "superadmin@roomfinder.vn",
    phone: "0900000002",
    avatar: "/admin-avatar-2.png",
    verified: true,
    joinedAt: "2023-01-01",
    isOwner: false,
    role: "super_admin",
    status: "active",
    lastLogin: "2024-01-21",
    permissions: ["all"],
    department: "System Administration",
  },
]

export const sampleTransactions: Transaction[] = [
  {
    id: "txn1",
    userId: "user1",
    roomId: "1",
    amount: 4500000,
    type: "deposit",
    status: "completed",
    createdAt: "2024-01-15",
    completedAt: "2024-01-15",
  },
  {
    id: "txn2",
    userId: "user1",
    roomId: "1",
    amount: 4500000,
    type: "monthly_rent",
    status: "completed",
    createdAt: "2024-01-20",
    completedAt: "2024-01-20",
  },
  {
    id: "txn3",
    userId: "user2",
    roomId: "2",
    amount: 6800000,
    type: "deposit",
    status: "pending",
    createdAt: "2024-01-21",
  },
]

export const sampleReports: Report[] = [
  {
    id: "rpt1",
    reporterId: "user1",
    targetType: "room",
    targetId: "3",
    reason: "Thông tin không chính xác",
    description: "Phòng thực tế không giống như mô tả, thiếu nhiều tiện nghi đã liệt kê",
    status: "pending",
    createdAt: "2024-01-20",
  },
  {
    id: "rpt2",
    reporterId: "user2",
    targetType: "user",
    targetId: "owner3",
    reason: "Hành vi không phù hợp",
    description: "Chủ trọ có thái độ không tốt, yêu cầu tiền thêm không hợp lý",
    status: "investigating",
    createdAt: "2024-01-19",
  },
]

export const sampleReviews: Review[] = [
  {
    id: "rev1",
    userId: "user1",
    roomId: "1",
    rating: 5,
    comment: "Phòng rất đẹp, chủ trọ thân thiện. Tôi rất hài lòng!",
    createdAt: "2024-01-18",
    status: "active",
    reportCount: 0,
  },
  {
    id: "rev2",
    userId: "user2",
    roomId: "2",
    rating: 4,
    comment: "Studio tốt nhưng hơi ồn vào buổi tối",
    createdAt: "2024-01-17",
    status: "active",
    reportCount: 0,
  },
]

export const sampleSystemConfig: SystemConfig[] = [
  {
    id: "cfg1",
    key: "max_image_size",
    value: 5242880, // 5MB
    description: "Kích thước tối đa cho ảnh tải lên (bytes)",
    category: "upload",
    updatedBy: "admin2",
    updatedAt: "2024-01-01",
  },
  {
    id: "cfg2",
    key: "payment_gateway",
    value: "vnpay",
    description: "Cổng thanh toán mặc định",
    category: "payment",
    updatedBy: "admin2",
    updatedAt: "2024-01-01",
  },
  {
    id: "cfg3",
    key: "auto_approve_verified_owners",
    value: true,
    description: "Tự động duyệt tin đăng từ chủ trọ đã xác minh",
    category: "security",
    updatedBy: "admin1",
    updatedAt: "2024-01-10",
  },
]

export const sampleTestimonials: Testimonial[] = [
  {
    id: "test1",
    user: {
      name: "Nguyễn Văn An",
      avatar: "/young-vietnamese-student.png",
      location: "Sinh viên tại Hà Nội",
    },
    rating: 5,
    comment: "Tôi đã tìm được phòng trọ hoàn hảo qua RoomFinder. Giao diện dễ sử dụng và thông tin rất chính xác!",
    date: "2024-01-15",
  },
  {
    id: "test2",
    user: {
      name: "Trần Thị Bình",
      avatar: "/vietnamese-office-worker.png",
      location: "Nhân viên văn phòng",
    },
    rating: 5,
    comment: "Dịch vụ tuyệt vời! Tôi đã thuê được studio gần công ty chỉ trong 2 ngày. Rất hài lòng!",
    date: "2024-01-10",
  },
  {
    id: "test3",
    user: {
      name: "Lê Minh Tuấn",
      avatar: "/vietnamese-man.png",
      location: "Chủ trọ tại Cầu Giấy",
    },
    rating: 4,
    comment: "Là chủ trọ, tôi thấy nền tảng này giúp tôi tìm được khách thuê uy tín một cách nhanh chóng.",
    date: "2024-01-08",
  },
]

// Sample amenities list
export const availableAmenities = [
  "WiFi miễn phí",
  "Điều hòa",
  "Tủ lạnh",
  "Máy giặt",
  "Bếp từ",
  "Lò vi sóng",
  "TV",
  "Sofa",
  "Bàn học",
  "Tủ quần áo",
  "Ban công",
  "Thang máy",
  "Bảo vệ 24/7",
  "Chỗ để xe",
  "Gần Metro",
  "Gần trường học",
  "Gần siêu thị",
  "Khu vực yên tĩnh",
]

// Sample districts in Hanoi
export const hanoiDistricts = [
  "Ba Đình",
  "Hoàn Kiếm",
  "Tây Hồ",
  "Long Biên",
  "Cầu Giấy",
  "Đống Đa",
  "Hai Bà Trưng",
  "Hoàng Mai",
  "Thanh Xuân",
  "Nam Từ Liêm",
  "Bắc Từ Liêm",
  "Hà Đông",
]

// Sample room types
export const roomTypes = [
  { value: "single", label: "Phòng đơn" },
  { value: "shared", label: "Phòng chia sẻ" },
  { value: "studio", label: "Studio" },
  { value: "apartment", label: "Căn hộ mini" },
]

// Sample price ranges
export const priceRanges = [
  { min: 0, max: 3000000, label: "Dưới 3 triệu" },
  { min: 3000000, max: 5000000, label: "3 - 5 triệu" },
  { min: 5000000, max: 8000000, label: "5 - 8 triệu" },
  { min: 8000000, max: 15000000, label: "8 - 15 triệu" },
  { min: 15000000, max: 999999999, label: "Trên 15 triệu" },
]
