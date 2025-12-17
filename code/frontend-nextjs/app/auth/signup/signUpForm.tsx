"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { api } from "@/services/api";

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { username, fullName, email, password, confirmPassword } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Register the user using the api service
      await api.register({
        username,
        password,
        fullName,
        email,
        role: "ROLE_USER"
      });

      toast.success("Account created successfully! Please sign in.");

      // Redirect to sign in page after 1.5 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);

    } catch (error: any) {
      toast.error(error.message || "Sign up failed");
      setIsLoading(false);
    }
  };

  return (
      <div className="flex justify-center items-center h-screen">
        <form
            onSubmit={handleSubmit}
            className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col"
        >
          <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
          <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
            >
              Username
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleChange}
                required
                disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="fullName"
            >
              Full Name
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={handleChange}
                required
                disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
            >
              Email
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleChange}
                required
                disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
            >
              Password
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                placeholder="******************"
                value={password}
                onChange={handleChange}
                required
                disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="******************"
                value={confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
            <Link
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="/auth/signin"
            >
              Already have an account?
            </Link>
          </div>
        </form>
        <ToastContainer autoClose={3000} hideProgressBar />
      </div>
  );
}
