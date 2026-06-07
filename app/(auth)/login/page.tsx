"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/lib/context"
import type { UserRole } from "@/lib/types"
import { Mail, Building2, UserCheck, Users } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
	const router = useRouter()
	const { setRol } = useApp()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const handleLogin = (role?: UserRole) => {
		if (role) {
			setRol(role)
		}
		router.push("/")
	}

	const quickAccessButtons = [
		{
			role: "gerencia" as UserRole,
			label: "Gerencia",
			icon: Building2,
			description: "Ver mis planes de acción",
		},
		{
			role: "auditor" as UserRole,
			label: "Auditor Interno",
			icon: UserCheck,
			description: "Gestionar seguimientos",
		},
		{
			role: "comite" as UserRole,
			label: "Comité / Alta Dirección",
			icon: Users,
			description: "Ver reportes ejecutivos",
		},
	]

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-4">
			<div className="w-full max-w-md space-y-6">
				{/* Logo */}
				<div className="flex flex-col items-center space-y-2">
					<Image src="/logo.svg" alt="Ingeniería Simple" width={200} height={87} />
					<div className="text-center">
						<p className="text-sm text-muted-foreground">Sistema de Seguimiento de Auditorías</p>
					</div>
				</div>

				{/* Login Card */}
				<Card className="shadow-xl">
					<CardHeader className="space-y-1">
						<CardTitle className="text-xl">Iniciar Sesión</CardTitle>
						<CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Correo Corporativo</Label>
							<Input
								id="email"
								type="email"
								placeholder="usuario@ingenieriasimple.cl"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Contraseña</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<Button className="w-full" size="lg" onClick={() => handleLogin()}>
							Ingresar
						</Button>

						<div className="relative py-4">
							<Separator />
							<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
								o acceso rápido como
							</span>
						</div>

						<div className="grid gap-2">
							{quickAccessButtons.map(({ role, label, icon: Icon, description }) => (
								<Button
									key={role}
									variant="outline"
									className="h-auto justify-start gap-3 p-3 bg-transparent"
									onClick={() => handleLogin(role)}
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Icon className="h-5 w-5" />
									</div>
									<div className="text-left">
										<div className="font-medium">{label}</div>
										<div className="text-xs text-muted-foreground">{description}</div>
									</div>
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				<p className="text-center text-xs text-muted-foreground">
					Ingeniería Simple &copy; 2025. Todos los derechos reservados.
				</p>
			</div>
		</div>
	)
}
