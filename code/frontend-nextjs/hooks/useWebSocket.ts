import { useEffect, useState, useRef } from 'react'
import {User, ChatNotification, ChatMessage} from '@/types'
import { WebSocketService } from '@/services/websocket'
import { api } from '@/services/api'


export function useWebSocket(currentUser: User | null) {
    const [users, setUsers] = useState<User[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const wsServiceRef = useRef<WebSocketService | null>(null)
    const notificationCallbackRef = useRef<((notification: ChatNotification) => void) | null>(null)

    useEffect(() => {
        if (!currentUser) return

        const wsService = new WebSocketService()
        wsServiceRef.current = wsService

        wsService.connect(
            currentUser,
            () => {
                setIsConnected(true)
                loadUsers()
            },
            (user) => {
                setUsers((prev) => {
                    const exists = prev.find((u) => u.nickName === user.nickName)
                    if (exists) {
                        return prev.map((u) => (u.nickName === user.nickName ? user : u))
                    }
                    return [...prev, user]
                })
            },
            (notification) => {
                if (notificationCallbackRef.current) {
                    notificationCallbackRef.current(notification)
                }
            },
            (error) => {
                console.error('WebSocket error:', error)
                setIsConnected(false)
            }
        )

        async function loadUsers() {
            if (!currentUser) return;

            const connectedUsers = await api.getConnectedUsers()
            setUsers(connectedUsers.filter((u) => u.nickName !== currentUser.nickName))
        }

        return () => {
            wsService.disconnect(currentUser)
        }
    }, [currentUser])

    const setNotificationCallback = (callback: (notification: ChatNotification) => void) => {
        notificationCallbackRef.current = callback
    }

    const sendMessage = (message: ChatMessage) => {
        wsServiceRef.current?.sendMessage(message)
    }

    return { users, isConnected, sendMessage, setNotificationCallback }
}
