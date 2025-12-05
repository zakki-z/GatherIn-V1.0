'use client';

import React from 'react';
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
            const success = await connectUser(data);
            if (success) {
                onLoginSuccess();
            }
        } catch (e) {
            console.error(e);

            // FIX 1: Use the standard "root" key for form-level errors.
            setError("root", {
                type: 'server',
                message: (e as Error).message || "Failed to connect to chat service. Check backend logs."
            });
        }
    };

    if (isConnected) return null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-900">Join the Chat</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* FIX 2: Access the root error using errors.root?.message */}
                    {errors.root?.message && (
                        // Display general connection error at the top
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
