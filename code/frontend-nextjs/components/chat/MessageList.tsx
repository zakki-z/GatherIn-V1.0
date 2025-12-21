'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from '@/types'

interface MessageListProps {
    messages: ChatMessage[]
    currentUserId: string
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message, index) => {
                const isCurrentUser = message.senderId === currentUserId
                const showDate = index === 0 ||
                    new Date(messages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString()

                return (
                    <div key={message.id || index}>
                        {showDate && (
                            <div className="flex justify-center my-4">
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    {new Date(message.timestamp).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        )}

                        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] sm:max-w-[60%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                                <div
                                    className={`px-4 py-2 rounded-2xl ${
                                        isCurrentUser
                                            ? 'bg-primary-600 text-white rounded-br-sm'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                                    }`}
                                >
                                    <p className="text-sm break-words">{message.content}</p>
                                </div>
                                <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            })}
            <div ref={messagesEndRef} />
        </div>
    )
}
