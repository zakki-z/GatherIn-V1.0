import { User, Status } from '@/types'
import Card from '../ui/Card'

interface UserListProps {
    users: User[]
    currentUser: User
    selectedUser: User | null
    onUserSelect: (user: User) => void
}

export default function UserList({ users, currentUser, selectedUser, onUserSelect }: UserListProps) {
    return (
        <div className="w-80 border-r bg-white flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Users Online</h2>
                <p className="text-sm text-gray-600">{users.length} active</p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {users.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No users online
                    </div>
                ) : (
                    <div className="divide-y">
                        {users.map((user) => (
                            <button
                                key={user.nickName}
                                onClick={() => onUserSelect(user)}
                                className={`w-full p-4 text-left hover:bg-gray-50 transition flex items-center gap-3 ${
                                    selectedUser?.nickName === user.nickName ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <span
                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                            user.status === Status.ONLINE ? 'bg-green-500' : 'bg-gray-400'
                                        }`}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{user.fullName}</p>
                                    <p className="text-sm text-gray-500 truncate">@{user.nickName}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
