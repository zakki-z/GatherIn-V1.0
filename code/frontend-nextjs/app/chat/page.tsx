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

    const { users, isConnected } = useWebSocket(currentUser)
    const { messages, sendMessage, loadMessages } = useChat(currentUser, selectedUser)

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
        <div className="h-screen flex flex-col">
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-semibold">Chat Application</h1>
                    <p className="text-sm text-gray-600">{currentUser.fullName}</p>
                </div>
                <div className="flex items-center gap-4">
          <span className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
          </span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
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
