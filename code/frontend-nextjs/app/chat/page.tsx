'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserList from '@/components/chat/UserList'
import ChatWindow from '@/components/chat/ChatWindow'
import { User } from '@/types'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useChat } from '@/hooks/useChat'

export default function ChatPage() {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
            router.push('/')
            return
        }
        setCurrentUser(JSON.parse(userStr))
    }, [router])

    const {users, isConnected} = useWebSocket(currentUser)
    const {messages, sendMessage, loadMessages} = useChat(currentUser, selectedUser)

    const handleUserSelect = (user: User) => {
        setSelectedUser(user)
        if (currentUser) {
            loadMessages(currentUser.nickName, user.nickName)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/')
    }

    if (!currentUser) {
        return null
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
            <header
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
                <div className="w-full sm:w-auto">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Chat Application</h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">{currentUser.fullName}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span
                    className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    <span
                        className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600 dark:bg-green-400 animate-pulse' : 'bg-red-600 dark:bg-red-400 animate-pulse'}`}/>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                    <button
                        onClick={handleLogout}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition-colors font-medium"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <UserList
                    users={users}
                    currentUser={currentUser}
                    selectedUser={selectedUser}
                    onUserSelect={handleUserSelect}
                />
                <ChatWindow
                    currentUser={currentUser}
                    selectedUser={selectedUser}
                    messages={messages}
                    onSendMessage={sendMessage}
                />
            </div>
        </div>
    )
}
