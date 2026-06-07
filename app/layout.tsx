import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AppProvider } from "@/lib/context"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Ingeniería Simple - Seguimiento de Auditorías",
	description: "Plataforma de seguimiento de planes de acción de auditorías",
	icons: {
		icon: [
			{
				url: "/logo.svg",
				type: "image/svg+xml",
			},
		],
		apple: [
			{
				url: "/logo.svg",
				type: "image/svg+xml",
			},
		],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="es">
			<body className={`font-sans antialiased`}>
				<AppProvider>
					{children}
					<Toaster position="top-right" richColors />
				</AppProvider>
			</body>
		</html>
	)
}
