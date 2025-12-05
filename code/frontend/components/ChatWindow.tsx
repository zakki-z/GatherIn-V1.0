'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/lib/Input';
import { Button } from '@/components/lib/Button';
import { useChat } from '@/hooks/ChatContext';
import Spinner from './lib/Spinner';

export const ChatWindow: React.FC = () => {
    const { currentUser, selectedUser, messages, sendMessage, isFetchingMessages } = useChat();
    const [messageContent, setMessageContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll to bottom whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageContent.trim() || !selectedUser) return;

        sendMessage(messageContent);
        setMessageContent('');
    };

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Your conversation history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
                {isFetchingMessages && (
                    <div className="flex justify-center py-4">
                        <Spinner />
                        <span className="ml-2 text-gray-500">Loading history...</span>
                    </div>
                )}

                {!isFetchingMessages && messages.length === 0 && (
                    <p className="text-center text-gray-500">Start a conversation with {selectedUser.fullName}.</p>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser?.nickName;
                    const timestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div
                            key={index} // Using index is safe here as chat history is not re-ordered
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow 
                ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-tl-none'}`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                <span className={`text-xs mt-1 block ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                  {timestamp}
                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                        placeholder={`Message ${selectedUser.fullName}`}
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        disabled={!selectedUser}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={!selectedUser || !messageContent.trim()}>
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
};
