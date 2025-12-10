import { useState, useEffect } from 'react'
import { ChatMessage, User, ChatNotification } from '@/types'
import { api } from '@/services/api'
import { useWebSocket } from './useWebSocket'

export function useChat(currentUser: User | null, selectedUser: User | null) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const { sendMessage: wsSendMessage, setNotificationCallback } = useWebSocket(currentUser)

    useEffect(() => {
        if (!currentUser) return

        setNotificationCallback((notification: ChatNotification) => {
            if (
                notification.senderId === selectedUser?.nickName ||
                notification.recipientId === selectedUser?.nickName
            ) {
                const newMessage: ChatMessage = {
                    id: notification.id,
                    senderId: notification.senderId,
                    recipientId: notification.recipientId,
                    content: notification.content,
                    timestamp: new Date(),
                }
                setMessages((prev) => [...prev, newMessage])
            }
        })
    }, [currentUser, selectedUser, setNotificationCallback])

    const loadMessages = async (senderId: string, recipientId: string) => {
        const chatMessages = await api.getChatMessages(senderId, recipientId)
        setMessages(chatMessages)
    }

    const sendMessage = (content: string) => {
        if (!currentUser || !selectedUser || !content.trim()) return

        const message: ChatMessage = {
            senderId: currentUser.nickName,
            recipientId: selectedUser.nickName,
            content: content.trim(),
            timestamp: new Date(),
        }

        wsSendMessage(message)
        setMessages((prev) => [...prev, message])
    }

    return { messages, sendMessage, loadMessages }
}
