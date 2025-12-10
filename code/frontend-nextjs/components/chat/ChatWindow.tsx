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
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg font-medium">Select a user to start chatting</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold">{selectedUser.fullName}</h2>
                <p className="text-sm text-gray-600">@{selectedUser.nickName}</p>
            </div>

            <MessageList messages={messages} currentUserId={currentUser.nickName} />
            <MessageInput onSendMessage={onSendMessage} />
        </div>
    )
}
