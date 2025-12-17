import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/services/api";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("🔐 Authorization attempt for:", credentials?.username);

                if (!credentials?.username || !credentials?.password) {
                    console.error("❌ Missing credentials");
                    return null;
                }

                try {
                    console.log("📡 Calling backend login API...");

                    // Use the unified API service to login
                    const data = await api.login({
                        username: credentials.username,
                        password: credentials.password
                    });

                    console.log("✅ Backend login successful");

                    // The backend returns { accessToken, refreshToken }
                    if (data && data.accessToken) {
                        console.log("✅ Tokens received, creating session");
                        return {
                            id: credentials.username,
                            name: credentials.username,
                            email: credentials.username, // Use username as email fallback
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken
                        };
                    }

                    console.error("❌ No access token in response");
                    return null;
                } catch (error: any) {
                    console.error("❌ Login failed:", error.message);

                    // Log more details to help debug
                    if (error.message.includes("Invalid credentials")) {
                        console.error("   → User doesn't exist or password is wrong");
                        console.error("   → Try creating an account first via /auth/signup");
                    } else if (error.message.includes("fetch")) {
                        console.error("   → Cannot reach backend. Is it running on http://localhost:8080?");
                    }

                    // Return null to trigger NextAuth error
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                console.log("💾 Storing tokens in JWT");
                token.accessToken = (user as any).accessToken;
                token.refreshToken = (user as any).refreshToken;
                token.username = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("📦 Creating session for:", token.username);
            // Send properties to the client
            return {
                ...session,
                user: {
                    ...session.user,
                    name: token.username as string,
                    accessToken: token.accessToken as string,
                }
            };
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin", // Redirect errors to signin (prevents /api/auth/error)
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = () => getServerSession(authOptions);
