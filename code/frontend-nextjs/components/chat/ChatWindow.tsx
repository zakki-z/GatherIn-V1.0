import { User, ChatMessage } from '@/types'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

interface ChatWindowProps {
    currentUser: User
    selectedUser: User | null
    messages: ChatMessage[]
    onSendMessage: (content: string) => void
}

export default function ChatWindow({ currentUser, selectedUser, messages, onSendMessage }: ChatWindowProps) {
    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-center text-gray-500 dark:text-gray-400 max-w-sm animate-fade-in">
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">Select a user to start chatting</p>
                    <p className="text-xs sm:text-sm mt-2 text-gray-500 dark:text-gray-500">Choose from the list to begin your conversation</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-gray-800 shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{selectedUser.fullName}</h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">@{selectedUser.username}</p>
            </div>

            <MessageList messages={messages} currentUserId={currentUser.username} />
            <MessageInput onSendMessage={onSendMessage} />
        </div>
    )
}
