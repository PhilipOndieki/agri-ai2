// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://agri-ai-backend-x7z5.onrender.com'

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Check sessionStorage first (matches auth-context)
    return sessionStorage.getItem('agriai_token') || localStorage.getItem('agriai_token')
  }
  return null
}

// Helper function for authenticated API calls
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken()
  
  // Create headers object with proper typing
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  return response
}

// Export API_URL for direct use if needed
export { API_URL }