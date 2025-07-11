import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Touchpay API Documentation",
  description: "Comprehensive API documentation for Touchpay",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <div
          className="flex flex-col min-h-screen"
          style={{ backgroundColor: "#0D0E0F" }}
        >
          {/* Content area with proper top margin for fixed header */}
          <div className="flex flex-1 pt-16">{children}</div>
        </div>
      </body>
    </html>
  )
}
