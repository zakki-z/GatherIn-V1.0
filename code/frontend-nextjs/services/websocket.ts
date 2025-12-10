import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { User, ChatMessage, ChatNotification } from '@/types'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws'
export class WebSocketService {
    private client: Client | null = null
    private reconnectDelay = 5000

    connect(
        user: User,
        onConnected: () => void,
        onUserUpdate: (user: User) => void,
        onMessageReceived: (notification: ChatNotification) => void,
        onError: (error: unknown) => void
    ) {
        this.client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket connected')

                // Subscribe to public user updates - CHANGED
                this.client?.subscribe('/topic/public', (message) => {
                    const userData = JSON.parse(message.body)
                    onUserUpdate(userData)
                })

                // Subscribe to private messages
                this.client?.subscribe(`/user/${user.nickName}/queue/messages`, (message) => {
                    const notification = JSON.parse(message.body)
                    onMessageReceived(notification)
                })

                // Register user
                this.client?.publish({
                    destination: '/app/user.addUser',
                    body: JSON.stringify(user),
                })

                onConnected()
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame)
                onError(frame)
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event)
                onError(event)
            },
        })

        this.client.activate()
    }

    sendMessage(message: ChatMessage) {
        if (this.client?.connected) {
            this.client.publish({
                destination: '/app/chat',
                body: JSON.stringify(message),
            })
        }
    }

    disconnect(user: User) {
        if (this.client?.connected) {
            this.client.publish({
                destination: '/app/user.disconnectUser',
                body: JSON.stringify(user),
            })
            this.client.deactivate()
        }
    }
}
