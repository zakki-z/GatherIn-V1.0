'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (nickName: string, fullName: string) => {
    setIsLoading(true)
    localStorage.setItem('user', JSON.stringify({ nickName, fullName }))
    router.push('/chat')
  }

  return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
      </main>
  )
}
