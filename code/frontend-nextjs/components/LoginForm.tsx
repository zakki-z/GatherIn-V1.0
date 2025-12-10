'use client'

import { useState, FormEvent } from 'react'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'

interface LoginFormProps {
    onLogin: (nickName: string, fullName: string) => void
    isLoading: boolean
}

export default function LoginForm({ onLogin, isLoading }: LoginFormProps) {
    const [nickName, setNickName] = useState('')
    const [fullName, setFullName] = useState('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (nickName.trim() && fullName.trim()) {
            onLogin(nickName.trim(), fullName.trim())
        }
    }

    return (
        <Card className="w-full max-w-md mx-4 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Welcome to Chat</h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">Enter your details to continue</p>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Nickname"
                        type="text"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        placeholder="john_doe"
                        required
                        disabled={isLoading}
                    />

                    <Input
                        label="Full Name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                        disabled={isLoading}
                    />
                </div>

                <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connecting...
                        </>
                    ) : (
                        'Join Chat'
                    )}
                </Button>
            </form>
        </Card>
    )
}
