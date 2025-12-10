export enum Status {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
}

export interface User {
    nickName: string
    fullName: string
    status?: Status
}

export interface ChatMessage {
    id?: string
    chatId?: string
    senderId: string
    recipientId: string
    content: string
    timestamp: Date
}

export interface ChatNotification {
    id: string
    senderId: string
    recipientId: string
    content: string
}
