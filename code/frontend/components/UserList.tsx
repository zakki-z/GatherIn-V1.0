'use client';

import React from 'react';
import { User } from '@/types/user';
import { useChat } from '@/hooks/ChatContext';

export const UserList: React.FC = () => {
    const { onlineUsers, selectUser, selectedUser, currentUser } = useChat();

    if (!currentUser) return null;

    // FIX: Explicitly filter out the current user from the list of available chat recipients.
    const usersForList = onlineUsers.filter(
        (user) => user.nickName !== currentUser.nickName
    );

    const sortedUsers = [...usersForList].sort((a, b) => a.fullName.localeCompare(b.fullName));

    return (
        <div className="w-full h-full border-r border-gray-200 overflow-y-auto">
            <div className="sticky top-0 p-4 bg-white border-b border-gray-200 z-10">
                <h2 className="text-lg font-semibold text-gray-800">Online Users ({sortedUsers.length})</h2>
            </div>

            {/* Current User Display */}
            <div className="p-4 border-b border-gray-100 bg-blue-50">
                <p className="font-bold text-blue-600">You: {currentUser.fullName}</p>
                <p className="text-sm text-blue-500">ID: {currentUser.nickName}</p>
            </div>

            {/* Other Users List */}
            <ul className="divide-y divide-gray-100">
                {sortedUsers.map((user) => (
                    <li key={user.nickName} className="list-none">
                        <button
                            onClick={() => selectUser(user)}
                            className={`w-full text-left p-4 cursor-pointer transition duration-150 
        ${selectedUser?.nickName === user.nickName
                                ? 'bg-blue-100 border-l-4 border-blue-600'
                                : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-800">{user.fullName}</span>
                                <span className="text-xs text-green-500 flex items-center">
                <span className="w-2 bg-green-500 rounded-full"></span>
                Online
            </span>
                            </div>
                            <p className="text-sm text-gray-500">@{user.nickName}</p>
                        </button>
                    </li>

                ))}
            </ul>

            {sortedUsers.length === 0 && (
                <p className="p-4 text-center text-gray-500 text-sm">No other users online yet.</p>
            )}
        </div>
    );
};
