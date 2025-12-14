import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import { ChatMessage, User } from '@/types'

export function useChat(currentUser: User | null, selectedUser: User | null, token: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([])

    // Wrapped in useCallback to ensure stability in dependency arrays
    const loadMessages = useCallback(async () => {
        if (!currentUser || !selectedUser || !token) return

        try {
            // Pass the token to the API call
            const chatMessages = await api.getChatMessages(
                currentUser.nickName,
                selectedUser.nickName,
                token
            )
            setMessages(chatMessages)
        } catch (error) {
            console.error("Failed to load chat history:", error)
            setMessages([])
        }
    }, [currentUser, selectedUser, token])

    // Automatically load messages when the selected user changes
    useEffect(() => {
        loadMessages()
    }, [loadMessages])

    // Expose setMessages so the parent component can add real-time messages
    return { messages, setMessages, loadMessages }
}
