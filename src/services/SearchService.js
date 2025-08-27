import axios from "axios"

// Base URL for ASP.NET Web API
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:5001/api"

class SearchService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem("authToken")
          window.location.href = "/login"
        }
        return Promise.reject(error)
      },
    )
  }

  // Search rooms based on criteria
  async searchRooms(searchCriteria) {
    try {
      const response = await this.api.post("/rooms/search", searchCriteria)
      return response.data
    } catch (error) {
      console.error("Error searching rooms:", error)
      throw error
    }
  }

  // Get room details by ID
  async getRoomById(roomId) {
    try {
      const response = await this.api.get(`/rooms/${roomId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching room details:", error)
      throw error
    }
  }

  // Get featured rooms
  async getFeaturedRooms() {
    try {
      const response = await this.api.get("/rooms/featured")
      return response.data
    } catch (error) {
      console.error("Error fetching featured rooms:", error)
      throw error
    }
  }

  // Get rooms by location
  async getRoomsByLocation(location) {
    try {
      const response = await this.api.get(`/rooms/location/${encodeURIComponent(location)}`)
      return response.data
    } catch (error) {
      console.error("Error fetching rooms by location:", error)
      throw error
    }
  }
}

export default new SearchService()
