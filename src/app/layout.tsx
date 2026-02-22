import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TaskBoard from "@/components/TaskBoard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "任務看板 Task Board",
  description: "AI Task Management Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <TaskBoard />
      </body>
    </html>
  );
}
