import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:5001/api"

class UserService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  // User authentication
  async login(credentials) {
    try {
      const response = await this.api.post("/auth/login", credentials)
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async register(userData) {
    try {
      const response = await this.api.post("/auth/register", userData)
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  async logout() {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("authToken")
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await this.api.put("/users/profile", userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      localStorage.setItem("user", JSON.stringify(response.data))
      return response.data
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }
}

export default new UserService()
