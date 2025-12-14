import { User, ChatMessage, LoginRequest, RegisterRequest } from '@/types';

// Use a single source for the URL. You can keep utils/constants.tsx or just define it here.
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8080';

// Helper for authorized headers
const getAuthHeaders = (token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // --- AUTHENTICATION ENDPOINTS ---

    async login(credentials: LoginRequest) {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) throw new Error("Invalid credentials");

            // Returns { accessToken, refreshToken }
            return await response.json();
        } catch (error: any) {
            throw new Error(error.message || "Authentication failed");
        }
    },

    async register(data: RegisterRequest) {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    role: "ROLE_USER" // Ensure default role is set
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Sign-up failed");
            }

            return { success: true };
        } catch (error: any) {
            throw new Error(error.message || "Sign-up failed");
        }
    },

    // --- DATA ENDPOINTS ---

    async getConnectedUsers(token: string): Promise<User[]> {
        try {
            const response = await fetch(`${API_URL}/users`, {
                headers: getAuthHeaders(token)
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    async getChatMessages(senderId: string, recipientId: string, token: string): Promise<ChatMessage[]> {
        try {
            const response = await fetch(`${API_URL}/messages/${senderId}/${recipientId}`, {
                headers: getAuthHeaders(token)
            });
            if (!response.ok) throw new Error('Failed to fetch messages');
            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },
};
