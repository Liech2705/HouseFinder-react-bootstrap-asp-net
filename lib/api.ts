// API service layer for ASP.NET backend integration
import type { Room, User, Testimonial, SearchFilters } from "./sample-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001/api"

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Room-related API calls
  async getRooms(filters?: Partial<SearchFilters>): Promise<Room[]> {
    const queryParams = new URLSearchParams()

    if (filters?.location) queryParams.append("location", filters.location)
    if (filters?.roomType) queryParams.append("roomType", filters.roomType)
    if (filters?.priceRange?.min) queryParams.append("minPrice", filters.priceRange.min.toString())
    if (filters?.priceRange?.max) queryParams.append("maxPrice", filters.priceRange.max.toString())
    if (filters?.amenities?.length) queryParams.append("amenities", filters.amenities.join(","))

    const endpoint = `/rooms${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return this.request<Room[]>(endpoint)
  }

  async getRoomById(id: string): Promise<Room> {
    return this.request<Room>(`/rooms/${id}`)
  }

  async createRoom(room: Omit<Room, "id" | "createdAt">): Promise<Room> {
    return this.request<Room>("/rooms", {
      method: "POST",
      body: JSON.stringify(room),
    })
  }

  async updateRoom(id: string, room: Partial<Room>): Promise<Room> {
    return this.request<Room>(`/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(room),
    })
  }

  async deleteRoom(id: string): Promise<void> {
    return this.request<void>(`/rooms/${id}`, {
      method: "DELETE",
    })
  }

  // User-related API calls
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users")
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`)
  }

  async createUser(user: Omit<User, "id" | "joinedAt">): Promise<User> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })
  }

  // Authentication API calls
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: {
    name: string
    email: string
    password: string
    phone: string
  }): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout(): Promise<void> {
    return this.request<void>("/auth/logout", {
      method: "POST",
    })
  }

  // Testimonials API calls
  async getTestimonials(): Promise<Testimonial[]> {
    return this.request<Testimonial[]>("/testimonials")
  }

  async createTestimonial(testimonial: Omit<Testimonial, "id" | "date">): Promise<Testimonial> {
    return this.request<Testimonial>("/testimonials", {
      method: "POST",
      body: JSON.stringify(testimonial),
    })
  }

  // Search API calls
  async searchRooms(query: string): Promise<Room[]> {
    return this.request<Room[]>(`/search?q=${encodeURIComponent(query)}`)
  }

  // Statistics API calls
  async getStatistics(): Promise<{
    totalRooms: number
    totalOwners: number
    totalUsers: number
    totalDistricts: number
  }> {
    return this.request("/statistics")
  }
}

export const apiService = new ApiService()
export default apiService
