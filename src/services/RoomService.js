import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:5001/api"

class RoomService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  // Create new room listing
  async createRoom(roomData) {
    try {
      const response = await this.api.post("/rooms", roomData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error creating room:", error)
      throw error
    }
  }

  // Update room listing
  async updateRoom(roomId, roomData) {
    try {
      const response = await this.api.put(`/rooms/${roomId}`, roomData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error updating room:", error)
      throw error
    }
  }

  // Delete room listing
  async deleteRoom(roomId) {
    try {
      const response = await this.api.delete(`/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error deleting room:", error)
      throw error
    }
  }

  // Get user's room listings
  async getUserRooms() {
    try {
      const response = await this.api.get("/rooms/my-listings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching user rooms:", error)
      throw error
    }
  }

  // Book a room
  async bookRoom(roomId, bookingData) {
    try {
      const response = await this.api.post(`/rooms/${roomId}/book`, bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error booking room:", error)
      throw error
    }
  }

  // Add review for a room
  async addReview(roomId, reviewData) {
    try {
      const response = await this.api.post(`/rooms/${roomId}/reviews`, reviewData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error adding review:", error)
      throw error
    }
  }

  // Get reviews for a room
  async getRoomReviews(roomId) {
    try {
      const response = await this.api.get(`/rooms/${roomId}/reviews`)
      return response.data
    } catch (error) {
      console.error("Error fetching reviews:", error)
      throw error
    }
  }
}

export default new RoomService()
