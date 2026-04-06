import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Contract Bingo",
    description: "Contract bingo for Hitman: WoA",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} bg-slate-900 text-white text-base`}
            >
                <ConvexClientProvider>{children}</ConvexClientProvider>
            </body>
        </html>
    );
}
