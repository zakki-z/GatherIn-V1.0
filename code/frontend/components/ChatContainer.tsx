'use client';

import React from 'react';
import { useChat } from '@/hooks/ChatContext';
import { ChatHeader } from './ChatHeader';
import { ChatWindow } from './ChatWindow';
import { UserList } from './UserList';

export const ChatContainer: React.FC = () => {
    const { isConnected } = useChat();

    // Show loading state while WebSocket is connecting
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Connecting to chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen max-h-screen antialiased bg-gray-100">
            <ChatHeader />
            <div className="flex flex-1 overflow-hidden">
                {/* User List Sidebar */}
                <div className="w-80 flex-shrink-0 h-full">
                    <UserList />
                </div>

                {/* Chat Window Area */}
                <main className="flex-1 h-full overflow-hidden flex flex-col">
                    <ChatWindow />
                </main>
            </div>
        </div>
    );
};
