export interface ChatMessage {
    id?: string;
    chatId?: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: Date | string; // Use string for DTO before converting to Date
}

export interface ChatNotification {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
}
