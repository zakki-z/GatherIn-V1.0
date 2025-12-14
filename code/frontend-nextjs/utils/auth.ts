import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/services/api"; //

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                try {
                    // Use the unified API service to login
                    const data = await api.login({
                        username: credentials.username,
                        password: credentials.password
                    });

                    // The backend returns { accessToken, refreshToken } but no user details.
                    // We map the input username to the session user so it's available.
                    if (data && data.accessToken) {
                        return {
                            id: credentials.username,
                            name: credentials.username,
                            email: null, // or credentials.email if available
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken
                        };
                    }
                    return null;
                } catch (e) {
                    console.error("Login failed:", e);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.refreshToken = (user as any).refreshToken;
                token.username = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            return {
                ...session,
                user: {
                    ...session.user,
                    name: token.username as string,
                    accessToken: token.accessToken as string,
                    // refreshToken: token.refreshToken as string // Optional: exclude if not needed on client
                }
            };
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = () => getServerSession(authOptions);
