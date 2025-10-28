"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  farmSize?: string
  token?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://agri-ai-backend-x7z5.onrender.com'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = sessionStorage.getItem("agriai_user")
    const storedToken = sessionStorage.getItem("agriai_token")
    
    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser)
      setUser({ ...userData, token: storedToken })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const result = await response.json()
      
      // Backend returns { success, message, data: { user, token, refreshToken } }
      const apiUser = result.data.user
      const token = result.data.token
      
      // Store user data and token
      const userData: User = {
        id: apiUser._id || apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone,
        location: apiUser.location,
        farmSize: apiUser.farmSize,
        token: token,
      }

      setUser(userData)
      sessionStorage.setItem("agriai_user", JSON.stringify(userData))
      sessionStorage.setItem("agriai_token", token)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Partial<User> & { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          location: userData.location,
          farmSize: userData.farmSize,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      const result = await response.json()

      // Backend returns { success, message, data: { user, token, refreshToken } }
      const apiUser = result.data.user
      const token = result.data.token

      const newUser: User = {
        id: apiUser._id || apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone,
        location: apiUser.location,
        farmSize: apiUser.farmSize,
        token: token,
      }

      setUser(newUser)
      sessionStorage.setItem("agriai_user", JSON.stringify(newUser))
      sessionStorage.setItem("agriai_token", token)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("agriai_user")
    sessionStorage.removeItem("agriai_token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}