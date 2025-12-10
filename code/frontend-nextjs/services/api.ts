import { User, ChatMessage } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = {
    async getConnectedUsers(): Promise<User[]> {
        try {
            const response = await fetch(`${API_URL}/users`)
            if (!response.ok) throw new Error('Failed to fetch users')
            return response.json()
        } catch (error) {
            console.error('Error fetching users:', error)
            return []
        }
    },

    async getChatMessages(senderId: string, recipientId: string): Promise<ChatMessage[]> {
        try {
            const response = await fetch(`${API_URL}/messages/${senderId}/${recipientId}`)
            if (!response.ok) throw new Error('Failed to fetch messages')
            return response.json()
        } catch (error) {
            console.error('Error fetching messages:', error)
            return []
        }
    },
}
