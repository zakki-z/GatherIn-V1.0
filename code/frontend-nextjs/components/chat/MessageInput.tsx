'use client'

import { useState, FormEvent } from 'react'
import Button from '../ui/Button'

interface MessageInputProps {
    onSendMessage: (content: string) => void
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
    const [message, setMessage] = useState('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
            onSendMessage(message)
            setMessage('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-800">
            <div className="flex gap-2 sm:gap-3">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                />
                <Button
                    type="submit"
                    disabled={!message.trim()}
                    className="flex-shrink-0 w-10 sm:w-auto sm:px-4"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="hidden sm:inline ml-2">Send</span>
                </Button>
            </div>
        </form>
    )
}
