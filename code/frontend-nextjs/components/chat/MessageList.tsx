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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
            {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-8 animate-fade-in">
                    No messages yet. Start the conversation!
                </div>
            ) : (
                messages.map((message, index) => {
                    const isOwnMessage = message.senderId === currentUserId
                    return (
                        <div
                            key={message.id || index}
                            className={`flex animate-slide-up ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-sm ${
                                    isOwnMessage
                                        ? 'bg-primary-600 dark:bg-primary-500 text-white rounded-br-none'
                                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'
                                }`}
                            >
                                <p className="break-words text-sm sm:text-base leading-relaxed">{message.content}</p>
                                <p
                                    className={`text-[10px] sm:text-xs mt-1 ${
                                        isOwnMessage ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
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
