'use client';

import React from 'react';
import { useChat } from '@/hooks/ChatContext';
import { ChatHeader } from './ChatHeader';
import { ChatWindow } from './ChatWindow';
import { UserList } from './UserList';

// This component acts as the main application layout and state provider
export const ChatContainer: React.FC = () => {
    const { isConnected } = useChat();

    if (!isConnected) return null;

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
