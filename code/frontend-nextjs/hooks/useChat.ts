import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import { ChatMessage, User } from '@/types'

export function useChat(currentUser: User | null, selectedUser: User | null, token: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([])

    const loadMessages = useCallback(async () => {
        if (!currentUser || !selectedUser || !token) return

        try {
            // CHANGED: nickName -> username
            const chatMessages = await api.getChatMessages(
                currentUser.username,
                selectedUser.username,
                token
            )
            setMessages(chatMessages)
        } catch (error) {
            console.error("Failed to load chat history:", error)
            setMessages([])
        }
    }, [currentUser, selectedUser, token])

    useEffect(() => {
        loadMessages()
    }, [loadMessages])

    return { messages, setMessages, loadMessages }
}
