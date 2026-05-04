import { supabase } from './supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  async generateRoutes(intakeData) {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch(`${API_BASE_URL}/routes/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(intakeData)
    })
    if (!res.ok) throw new Error('Failed to generate routes')
    return res.json()
  },

  async getRoutes() {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch(`${API_BASE_URL}/routes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to fetch routes')
    return res.json()
  },

  async getRouteById(routeId) {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to fetch route')
    return res.json()
  },

  async sendChatMessage(conversationId, message) {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ conversationId, message })
    })
    if (!res.ok) throw new Error('Failed to send message')
    return res.json()
  }
}