import Link from 'next/link'
import Image from "next/image"
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md text-center space-y-8 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 mb-6 bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 rounded-3xl flex items-center justify-center shadow-lg">
              <Image src="/chat.png" alt="GatherIn Logo" width={120} height={120} className="w-auto h-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GatherIn</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Connect, Chat, Gather.</p>
          </div>

          <div className="space-y-4">
            <Link href="/auth/signin" className="block w-full">
              <Button fullWidth className="bg-primary-600 hover:bg-primary-700">
                Log In
              </Button>
            </Link>

            <Link href="/auth/signup" className="block w-full">
              <Button fullWidth className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">
                Create Account
              </Button>
            </Link>
          </div>
        </Card>
      </main>
  )
}
