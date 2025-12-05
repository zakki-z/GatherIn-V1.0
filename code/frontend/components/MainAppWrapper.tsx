'use client';

import React, { useState } from 'react';
import { ChatContainer } from './ChatContainer';
import { LoginForm } from './LoginForm';
import { ChatProvider } from '@/hooks/ChatContext'; // FIX: Import the new provider

/**
 * Main application entry point that manages the login state.
 * This is a Client Component.
 */
export const MainAppWrapper: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // FIX: Wrap the application views with ChatProvider to share state
    return (
        <ChatProvider>
            {isLoggedIn ? (
                <ChatContainer />
            ) : (
                <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
            )}
        </ChatProvider>
    );
};
