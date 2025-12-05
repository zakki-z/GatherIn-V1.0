'use client';

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import type { Client, Message, Frame } from 'stompjs';
import { User, Status } from '@/types/user';
import { ChatMessage, ChatNotification } from '@/types/chat';
import { connectWebSocket } from '@/services/websocketService';
import { apiFetch } from '@/services/api';

// --- Type Definitions ---
interface UseChatHook {
    currentUser: User | null;
    selectedUser: User | null;
    onlineUsers: User[];
    messages: ChatMessage[];
    isConnected: boolean;
    connectUser: (user: Omit<User, 'status'>) => Promise<boolean>;
    disconnectUser: () => void;
    sendMessage: (content: string) => void;
    selectUser: (user: User) => void;
    isFetchingMessages: boolean;
}

const USER_PUBLIC_TOPIC = '/user/public';
const PRIVATE_MESSAGE_QUEUE = '/user/queue/messages';

// ----------------------------------------------------
// The actual hook logic, now powering the Provider
// ----------------------------------------------------
const useChatLogic = (): UseChatHook => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isFetchingMessages, setIsFetchingMessages] = useState(false);

    const stompClientRef = useRef<Client | null>(null);

    const handleUserUpdate = useCallback((payload: Message) => {
        const updatedUser: User = JSON.parse(payload.body);
        setOnlineUsers(prevUsers => {
            const filtered = prevUsers.filter(u => u.nickName !== updatedUser.nickName);
            if (updatedUser.status === Status.ONLINE && updatedUser.nickName !== currentUser?.nickName) {
                return [...filtered, updatedUser];
            }
            if (updatedUser.nickName === selectedUser?.nickName && updatedUser.status === Status.OFFLINE) {
                setSelectedUser(null);
            }
            return filtered;
        });
    }, [currentUser, selectedUser]);

    const handleNewMessage = useCallback((payload: Message) => {
        const notification: ChatNotification = JSON.parse(payload.body);
        const isActiveChat = (
            notification.senderId === selectedUser?.nickName &&
            notification.recipientId === currentUser?.nickName
        );
        if (isActiveChat) {
            const newMessage: ChatMessage = {
                id: notification.id,
                senderId: notification.senderId,
                recipientId: notification.recipientId,
                content: notification.content,
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, newMessage]);
        }
    }, [currentUser, selectedUser]);

    const disconnectUser = useCallback(() => {
        if (currentUser && stompClientRef.current?.connected) {
            stompClientRef.current.send('/app/user.disconnectUser', {}, JSON.stringify(currentUser));
            stompClientRef.current.disconnect(() => {
                console.log('Disconnected from STOMP');
            });
        }
        setCurrentUser(null);
        setSelectedUser(null);
        setIsConnected(false);
        setOnlineUsers([]);
        setMessages([]);
    }, [currentUser]);

    const fetchChatHistory = useCallback(async (senderId: string, recipientId: string) => {
        setIsFetchingMessages(true);
        try {
            const history = await apiFetch<ChatMessage[]>(`/messages/${senderId}/${recipientId}`);
            setMessages(history);
        } catch (e) {
            console.error('Failed to fetch chat history:', e);
            setMessages([]);
        } finally {
            setIsFetchingMessages(false);
        }
    }, []);

    const registerAndConnect = useCallback((user: Omit<User, 'status'>, client: Client, resolve: (value: boolean) => void) => {
        const newUser: User = { ...user, status: Status.ONLINE };
        setCurrentUser(newUser);

        client.send('/app/user.addUser', {}, JSON.stringify(newUser));
        client.subscribe(USER_PUBLIC_TOPIC, handleUserUpdate);
        client.subscribe(`${PRIVATE_MESSAGE_QUEUE}`, handleNewMessage);

        setIsConnected(true);
        resolve(true);
    }, [handleUserUpdate, handleNewMessage]);

    const connectUser = useCallback((user: Omit<User, 'status'>): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const client = connectWebSocket(
                (client: Client) => registerAndConnect(user, client, resolve),
                (error: string | Frame) => {
                    console.error('Connection failed, user not logged in.', error);
                    alert(`Failed to connect to chat service: ${error.toString()}`);
                    reject(new Error("Failed to connect to chat service."));
                }
            );
            stompClientRef.current = client;

            if (!client) {
                reject(new Error("Failed to initialize WebSocket."));
            }
        });
    }, [registerAndConnect]);

    const sendMessage = useCallback((content: string) => {
        if (!currentUser || !selectedUser || !stompClientRef.current?.connected || !content.trim()) {
            return;
        }

        const chatMessage: Omit<ChatMessage, 'id' | 'chatId'> = {
            senderId: currentUser.nickName,
            recipientId: selectedUser.nickName,
            content: content.trim(),
            timestamp: new Date().toISOString(),
        };

        stompClientRef.current.send('/app/chat', {}, JSON.stringify(chatMessage));

        const optimisticMessage: ChatMessage = {
            ...chatMessage,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMessage]);

    }, [currentUser, selectedUser]);

    const selectUser = useCallback((user: User) => {
        if (user.nickName === currentUser?.nickName) return;

        setSelectedUser(user);
        setMessages([]);

        if (currentUser) {
            fetchChatHistory(currentUser.nickName, user.nickName);
        }
    }, [currentUser, fetchChatHistory]);

    // --- Initial Load/Cleanup ---
    useEffect(() => {
        const fetchInitialUsers = async () => {
            try {
                const initialUsers = await apiFetch<User[]>('/users');
                setOnlineUsers(initialUsers.filter(u => u.status === Status.ONLINE));
            } catch (e) {
                console.error('Failed to fetch initial online users:', e);
            }
        };
        fetchInitialUsers();

        return () => {
            if (stompClientRef.current) {
                disconnectUser();
            }
        };
    }, [disconnectUser]);

    return {
        currentUser,
        selectedUser,
        onlineUsers,
        messages,
        isConnected,
        connectUser,
        disconnectUser,
        sendMessage,
        selectUser,
        isFetchingMessages,
    };
};

// --- Context Setup ---

const ChatContext = createContext<UseChatHook | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const chatState = useChatLogic();
    return (
        <ChatContext.Provider value={chatState}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook to use the chat context
export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
