import { BACKEND_API } from "./constants";

export default async function apiAuthSignIn(
    credentials: Record<"email" | "username" | "password", string> | undefined
) {
    try {
        // FIX 1: Change path to /login
        const response = await fetch(`${BACKEND_API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials"); // Throwing ensures NextAuth catches it
        }

        const data = await response.json();

        // FIX 2: Backend returns { accessToken, refreshToken }, not userID directly.
        // You might need to decode the token to get the ID, or assume the username is the ID.
        // For NextAuth, we just need to return the object containing the tokens.
        if (data.accessToken) {
            return data; // This object is passed to the authorize callback
        }

        return null;
    } catch (error: any) {
        throw new Error(error.message || "Authentication failed");
    }
}

export async function apiAuthSignUp(credentials: {
    username: string;
    email: string; // Note: Backend RegisterRequest doesn't seem to use email? Check RegisterRequest.java
    password: string;
    fullName: string; // Added fullName as Backend requires it
}) {
    try {
        // FIX 3: Change path to /register
        const response = await fetch(`${BACKEND_API}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
                fullName: credentials.fullName, // Ensure this is passed
                role: "ROLE_USER" // Ensure role is sent if required
            }),
        });

        if (!response.ok) {
            const errorData = await response.text(); // Backend might return string error
            throw new Error(errorData || "Sign-up failed");
        }

        // Backend returns string "User registered successfully", not JSON
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
