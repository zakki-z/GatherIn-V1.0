import { User, ChatMessage, LoginRequest, RegisterRequest } from '@/types';

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
            console.log("Attempting login with:", { username: credentials.username });

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            console.log("Login response status:", response.status);

            // Get response text first
            const responseText = await response.text();
            console.log("Login response body:", responseText);

            if (!response.ok) {
                // Try to parse as JSON for structured error
                let errorMessage = "Invalid credentials";
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    // If not JSON, use the text as-is
                    errorMessage = responseText || errorMessage;
                }

                console.error("Login failed:", errorMessage);
                throw new Error(errorMessage);
            }

            // Parse successful response
            const data = JSON.parse(responseText);
            console.log("Login successful, tokens received:", {
                hasAccessToken: !!data.accessToken,
                hasRefreshToken: !!data.refreshToken
            });

            return data;
        } catch (error: any) {
            console.error("Login error:", error);
            throw error; // Re-throw the original error
        }
    },

    async register(data: RegisterRequest) {
        try {
            console.log("Attempting registration for:", data.username);

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    role: data.role || "ROLE_USER"
                }),
            });

            console.log("Register response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Registration failed:", errorText);
                throw new Error(errorText || "Sign-up failed");
            }

            console.log("Registration successful");
            return { success: true };
        } catch (error: any) {
            console.error("Registration error:", error);
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
