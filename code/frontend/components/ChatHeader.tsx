import React from 'react';
import { useChat } from '@/hooks/ChatContext';
import { Button } from '@/components/lib/Button';

export const ChatHeader: React.FC = () => {
    const { selectedUser, disconnectUser } = useChat();

    return (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
            {selectedUser ? (
                <h2 className="text-xl font-bold text-gray-900">
                    Chatting with: <span className="text-blue-600">{selectedUser.fullName}</span>
                </h2>
            ) : (
                <h2 className="text-xl font-bold text-gray-900">Select a User to Chat</h2>
            )}
            <Button
                variant="danger"
                onClick={disconnectUser}
            >
                Logout
            </Button>
        </div>
    );
};
