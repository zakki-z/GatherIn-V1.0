'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'
import Image from "next/image"
import { api } from '@/services/api'

interface LoginFormProps {
    mode: 'login' | 'signup'
    onLoginSuccess: (username: string, fullName: string) => void
    isLoading?: boolean
}

export default function LoginForm({ mode, onLoginSuccess, isLoading: parentLoading }: LoginFormProps) {
    const isLogin = mode === 'login'
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                await api.auth.login({ username, password })
                onLoginSuccess(username, username)
            } else {
                await api.auth.register({
                    username,
                    password,
                    fullName,
                    role: 'ROLE_USER'
                })
                await api.auth.login({ username, password })
                onLoginSuccess(username, fullName)
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const isLoading = loading || parentLoading

    return (
        <Card className="w-full max-w-md mx-4 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {isLogin ? 'Enter your credentials to continue' : 'Sign up to get started'}
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {!isLogin && (
                        <Input
                            label="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            required
                            disabled={isLoading}
                        />
                    )}

                    <Input
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="john_doe"
                        required
                        disabled={isLoading}
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                </div>

                <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>

                <div className="text-center text-sm">
                    {isLogin ? (
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-primary-600 hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary-600 hover:underline font-medium">
                                Log in
                            </Link>
                        </p>
                    )}
                </div>
            </form>
        </Card>
    )
}
