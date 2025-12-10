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
        <Card className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome to Chat</h1>
                    <p className="text-sm text-gray-600 mt-2">Enter your details to continue</p>
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
                    {isLoading ? 'Connecting...' : 'Join Chat'}
                </Button>
            </form>
        </Card>
    )
}
