import { useEffect, useState, useRef } from 'react'
import { User, ChatNotification, ChatMessage } from '@/types'
import { WebSocketService } from '@/services/websocket'
import { api } from '@/services/api'

export function useWebSocket(currentUser: User | null, token: string) {
    const [users, setUsers] = useState<User[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const wsServiceRef = useRef<WebSocketService | null>(null)
    const notificationCallbackRef = useRef<((notification: ChatNotification) => void) | null>(null)

    useEffect(() => {
        if (!currentUser || !token) return

        const wsService = new WebSocketService()
        wsServiceRef.current = wsService

        const handlers = createWebSocketHandlers(currentUser, token, setIsConnected, setUsers, notificationCallbackRef)

        wsService.connect(currentUser, token, ...handlers)

        return () => {
            wsService.disconnect(currentUser)
        }
    }, [currentUser, token])

    const setNotificationCallback = (callback: (notification: ChatNotification) => void) => {
        notificationCallbackRef.current = callback
    }

    const sendMessage = (message: ChatMessage) => {
        wsServiceRef.current?.sendMessage(message)
    }

    return { users, isConnected, sendMessage, setNotificationCallback }
}

function createWebSocketHandlers(
    currentUser: User,
    token: string,
    setIsConnected: (connected: boolean) => void,
    setUsers: React.Dispatch<React.SetStateAction<User[]>>,
    notificationCallbackRef: React.MutableRefObject<((notification: ChatNotification) => void) | null>
) {
    const onConnect = async () => {
        setIsConnected(true)
        await loadUsers(currentUser, token, setUsers)
    }

    const onUserUpdate = (user: User) => {
        updateUserInList(user, setUsers)
    }

    const onNotification = (notification: ChatNotification) => {
        notificationCallbackRef.current?.(notification)
    }

    const onError = (error: any) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
    }

    return [onConnect, onUserUpdate, onNotification, onError] as const
}

async function loadUsers(
    currentUser: User,
    token: string,
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
) {
    try {
        const connectedUsers = await api.getConnectedUsers(token)
        // CHANGED: nickName -> username
        const filteredUsers = connectedUsers.filter((u) => u.username !== currentUser.username)
        setUsers(filteredUsers)
    } catch (error) {
        console.error("Failed to load users", error);
    }
}

function updateUserInList(
    user: User,
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
) {
    setUsers((prev) => {
        // CHANGED: nickName -> username
        const exists = prev.find((u) => u.username === user.username)
        if (exists) {
            return prev.map((u) => (u.username === user.username ? user : u))
        }
        return [...prev, user]
    })
}
