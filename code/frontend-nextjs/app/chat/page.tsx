'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import UserList from '@/components/chat/UserList'
import ChatWindow from '@/components/chat/ChatWindow'
import { User, Status, ChatNotification } from '@/types'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useChat } from '@/hooks/useChat'
import Image from "next/image";
import Link from "next/link";

export default function ChatPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    useEffect(() => {
        if (status === 'loading') return
        if (status === 'unauthenticated' || !session?.user) {
            router.push('/auth/signin')
            return
        }

        // CHANGED: nickName -> username
        const username = session.user.name || 'Unknown'
        if (currentUser?.username !== username) {
            setCurrentUser({
                username: username,
                fullName: username,
                status: Status.ONLINE
            })
        }
    }, [session, status, router, currentUser])

    const accessToken = (session as any)?.user?.accessToken || ''

    const { users, isConnected, sendMessage, setNotificationCallback } = useWebSocket(currentUser, accessToken)
    const { messages, setMessages, loadMessages } = useChat(currentUser, selectedUser, accessToken)

    useEffect(() => {
        if (!setNotificationCallback) return;

        setNotificationCallback((notification: ChatNotification) => {
            // CHANGED: nickName -> username
            if (selectedUser &&
                (notification.senderId === selectedUser.username || notification.senderId === currentUser?.username)) {

                setMessages(prev => [...prev, {
                    id: notification.id,
                    senderId: notification.senderId,
                    recipientId: notification.recipientId,
                    content: notification.content,
                    timestamp: new Date()
                }])
            }
        })
    }, [selectedUser, currentUser, setNotificationCallback, setMessages])

    const handleUserSelect = (user: User) => {
        setSelectedUser(user)
    }

    const handleSendMessage = (content: string) => {
        if (!currentUser || !selectedUser) return

        const message = {
            // CHANGED: nickName -> username
            senderId: currentUser.username,
            recipientId: selectedUser.username,
            content: content,
            timestamp: new Date()
        }

        sendMessage(message)
        setMessages(prev => [...prev, message])
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/auth/signin' })
    }

    if (!currentUser) {
        return <div className="h-screen flex items-center justify-center text-gray-500">Loading...</div>
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
                <div className="w-full sm:w-auto">
                    <Link href={"/"}>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Image src={"/gatherin.png"} alt={"GatherIn Logo"} width={40} height={40} className="w-10 h-10"/>
                            <span className="font-bold text-xl text-primary-600">GatherIn</span>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600 dark:bg-green-400 animate-pulse' : 'bg-red-600 dark:bg-red-400 animate-pulse'}`}/>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">{currentUser.fullName}</p>
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
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    )
}
