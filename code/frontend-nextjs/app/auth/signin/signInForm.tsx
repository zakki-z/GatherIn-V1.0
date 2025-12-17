"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error("Authentication failed. Please check your credentials.");
    }
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Basic validation
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: username.trim(),
        password: password,
        redirect: false,
      });

      console.log("SignIn result:", result); // Debug log

      if (result?.error) {
        // Handle specific error messages
        console.error("SignIn error:", result.error);
        toast.error(result.error || "Invalid username or password");
        setIsLoading(false);
      } else if (result?.ok) {
        toast.success("Login successful!");
        // Small delay to show the success message
        setTimeout(() => {
          router.push("/chat");
        }, 500);
      } else {
        toast.error("An unexpected error occurred");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during login");
      setIsLoading(false);
    }
  }

  return (
      <div className="container mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
            >
              Username
            </label>
            <input
                className="border border-gray-400 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
            />
          </div>

          <div>
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
            >
              Password
            </label>
            <input
                className="border border-gray-400 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />
          </div>

          <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              type="submit"
              disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don&#39;t have an account?{" "}
              <Link
                  href="/auth/signup"
                  className="text-blue-500 hover:text-blue-800 font-bold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
        <ToastContainer autoClose={3000} hideProgressBar />
      </div>
  );
}
