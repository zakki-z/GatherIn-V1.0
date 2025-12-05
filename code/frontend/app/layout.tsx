import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
    title: "Next.js STOMP Chat",
    description: "Minimal Next.js frontend for Spring Boot WebSocket Chat.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
