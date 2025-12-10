import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { User, ChatMessage, ChatNotification } from '@/types'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws'

export class WebSocketService {
    private client: Client | null = null
    private reconnectDelay = 5000
    private user: User | null = null
    private callbacks = {
        onConnected: () => {},
        onUserUpdate: (user: User) => {},
        onMessageReceived: (notification: ChatNotification) => {},
        onError: (error: unknown) => {},
    }

    connect(
        user: User,
        onConnected: () => void,
        onUserUpdate: (user: User) => void,
        onMessageReceived: (notification: ChatNotification) => void,
        onError: (error: unknown) => void
    ) {
        this.user = user
        this.callbacks = { onConnected, onUserUpdate, onMessageReceived, onError }

        this.client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => this.handleConnect(),
            onStompError: (frame) => this.handleStompError(frame),
            onWebSocketError: (event) => this.handleWebSocketError(event),
        })

        this.client.activate()
    }

    private handleConnect() {
        console.log('WebSocket connected')

        this.subscribeToPublicUpdates()
        this.subscribeToPrivateMessages()
        this.registerUser()

        this.callbacks.onConnected()
    }

    private subscribeToPublicUpdates() {
        this.client?.subscribe('/topic/public', (message) => {
            const userData = JSON.parse(message.body)
            this.callbacks.onUserUpdate(userData)
        })
    }

    private subscribeToPrivateMessages() {
        if (!this.user) return

        this.client?.subscribe(
            `/user/${this.user.nickName}/queue/messages`,
            (message) => {
                const notification = JSON.parse(message.body)
                this.callbacks.onMessageReceived(notification)
            }
        )
    }

    private registerUser() {
        if (!this.user) return

        this.client?.publish({
            destination: '/app/user.addUser',
            body: JSON.stringify(this.user),
        })
    }

    private handleStompError(frame: unknown) {
        console.error('STOMP error:', frame)
        this.callbacks.onError(frame)
    }

    private handleWebSocketError(event: unknown) {
        console.error('WebSocket error:', event)
        this.callbacks.onError(event)
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
