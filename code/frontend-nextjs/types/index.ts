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

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    username: string;
    password: string;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}
