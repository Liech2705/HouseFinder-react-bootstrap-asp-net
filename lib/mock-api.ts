// Mock API service for development/testing
import {
  sampleRooms,
  sampleUsers,
  sampleTestimonials,
  type Room,
  type User,
  type Testimonial,
  type SearchFilters,
} from "./sample-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class MockApiService {
  private rooms: Room[] = [...sampleRooms]
  private users: User[] = [...sampleUsers]
  private testimonials: Testimonial[] = [...sampleTestimonials]

  async getRooms(filters?: Partial<SearchFilters>): Promise<Room[]> {
    await delay(500) // Simulate network delay

    let filteredRooms = [...this.rooms]

    if (filters?.location) {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.location.address.toLowerCase().includes(filters.location!.toLowerCase()) ||
          room.location.district.toLowerCase().includes(filters.location!.toLowerCase()),
      )
    }

    if (filters?.roomType) {
      filteredRooms = filteredRooms.filter((room) => room.roomType === filters.roomType)
    }

    if (filters?.priceRange) {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.price >= (filters.priceRange!.min || 0) &&
          room.price <= (filters.priceRange!.max || Number.POSITIVE_INFINITY),
      )
    }

    if (filters?.amenities?.length) {
      filteredRooms = filteredRooms.filter((room) =>
        filters.amenities!.some((amenity) => room.amenities.includes(amenity)),
      )
    }

    return filteredRooms
  }

  async getRoomById(id: string): Promise<Room | null> {
    await delay(300)
    return this.rooms.find((room) => room.id === id) || null
  }

  async createRoom(roomData: Omit<Room, "id" | "createdAt">): Promise<Room> {
    await delay(800)

    const newRoom: Room = {
      ...roomData,
      id: `room_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    }

    this.rooms.push(newRoom)
    return newRoom
  }

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room | null> {
    await delay(600)

    const roomIndex = this.rooms.findIndex((room) => room.id === id)
    if (roomIndex === -1) return null

    this.rooms[roomIndex] = { ...this.rooms[roomIndex], ...updates }
    return this.rooms[roomIndex]
  }

  async deleteRoom(id: string): Promise<boolean> {
    await delay(400)

    const roomIndex = this.rooms.findIndex((room) => room.id === id)
    if (roomIndex === -1) return false

    this.rooms.splice(roomIndex, 1)
    return true
  }

  async getUsers(): Promise<User[]> {
    await delay(400)
    return [...this.users]
  }

  async getUserById(id: string): Promise<User | null> {
    await delay(300)
    return this.users.find((user) => user.id === id) || null
  }

  async getTestimonials(): Promise<Testimonial[]> {
    await delay(300)
    return [...this.testimonials]
  }

  async searchRooms(query: string): Promise<Room[]> {
    await delay(600)

    const lowercaseQuery = query.toLowerCase()
    return this.rooms.filter(
      (room) =>
        room.title.toLowerCase().includes(lowercaseQuery) ||
        room.description.toLowerCase().includes(lowercaseQuery) ||
        room.location.address.toLowerCase().includes(lowercaseQuery) ||
        room.location.district.toLowerCase().includes(lowercaseQuery),
    )
  }

  async getStatistics(): Promise<{
    totalRooms: number
    totalOwners: number
    totalUsers: number
    totalDistricts: number
  }> {
    await delay(400)

    const uniqueOwners = new Set(this.rooms.map((room) => room.owner.id))
    const uniqueDistricts = new Set(this.rooms.map((room) => room.location.district))

    return {
      totalRooms: this.rooms.length,
      totalOwners: uniqueOwners.size,
      totalUsers: this.users.length,
      totalDistricts: uniqueDistricts.size,
    }
  }
}

export const mockApiService = new MockApiService()
