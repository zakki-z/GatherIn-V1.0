import { useEffect, useRef } from 'react'
import { ChatMessage } from '@/types'

interface MessageListProps {
    messages: ChatMessage[]
    currentUserId: string
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm mt-8">
                    No messages yet. Start the conversation!
                </div>
            ) : (
                messages.map((message, index) => {
                    const isOwnMessage = message.senderId === currentUserId
                    return (
                        <div
                            key={message.id || index}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    isOwnMessage
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                }`}
                            >
                                <p className="break-words">{message.content}</p>
                                <p
                                    className={`text-xs mt-1 ${
                                        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                                    }`}
                                >
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    )
                })
            )}
            <div ref={messagesEndRef} />
        </div>
    )
}
