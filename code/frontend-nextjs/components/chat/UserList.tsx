import { User, Status } from '@/types'

interface UserListProps {
    users: User[]
    currentUser: User
    selectedUser: User | null
    onUserSelect: (user: User) => void
}

export default function UserList({ users, currentUser, selectedUser, onUserSelect }: UserListProps) {
    return (
        <div className="w-full sm:w-72 md:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col absolute sm:relative h-full sm:h-auto z-10 sm:z-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Users Online</h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {users.length} active
                </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {users.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm animate-fade-in">
                        No users online
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <button
                                key={user.username}
                                onClick={() => onUserSelect(user)}
                                className={`w-full p-3 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all flex items-center gap-3 animate-fade-in ${
                                    selectedUser?.username === user.username
                                        ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                                        : ''
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-sm">
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <span
                                        className={`absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                                            user.status === Status.ONLINE ? 'bg-green-500' : 'bg-gray-400'
                                        }`}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">
                                        {user.fullName}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                        @{user.username}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
