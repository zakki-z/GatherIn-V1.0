'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { Button } from '@/components/lib/Button';
import { Input } from '@/components/lib/Input';
import { useChat } from '@/hooks/ChatContext';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const { connectUser, isConnected } = useChat();
    const [isConnecting, setIsConnecting] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsConnecting(true);
            const success = await connectUser(data);
            if (success) {
                onLoginSuccess();
            }
        } catch (e) {
            console.error(e);
            setError("root", {
                type: 'server',
                message: (e as Error).message || "Failed to connect to chat service. Check backend logs."
            });
        } finally {
            setIsConnecting(false);
        }
    };

    if (isConnected) return null;

    // Show connecting state
    if (isConnecting) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <h2 className="text-xl font-semibold text-gray-900">Connecting to chat...</h2>
                    <p className="text-sm text-gray-600">Please wait while we establish your connection</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-900">Join the Chat</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {errors.root?.message && (
                        <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
                    )}
                    <Input
                        label="Nickname (Used as ID)"
                        placeholder="e.g., john_doe"
                        {...register('nickName')}
                        error={errors.nickName?.message}
                    />
                    <Input
                        label="Full Name"
                        placeholder="e.g., John Doe"
                        {...register('fullName')}
                        error={errors.fullName?.message}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Connecting...' : 'Start Chatting'}
                    </Button>
                </form>
            </div>
        </div>
    );
};
