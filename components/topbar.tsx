"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { RoleSwitcher } from "@/components/role-switcher"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { MainNavigation } from "@/components/main-navigation"
import { useApp } from "@/lib/context"
import { Search, LogOut, User, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Topbar() {
	const { rol } = useApp()

	const userName =
		rol === "gerencia" ? "María González" : rol === "auditor" ? "Ana Martínez" : "Roberto Fernández"
	const userInitials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")

	return (
		<header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
			<div className="flex items-center gap-6">
				<Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
					<div className="flex flex-col">
						<Image src="/correoschile-logo.svg" alt="Logo" width={130} height={20} />
						<span className="text-[10px] font-semibold uppercase tracking-wider text-nowrap text-slate-500">
							Sistema de Auditoría
						</span>
					</div>
				</Link>

				<div className="hidden lg:block">
					<MainNavigation />
				</div>
			</div>

			<div className="flex items-center gap-2">
				<div className="relative hidden xl:block">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<Input
						placeholder="Buscar planes, auditorías..."
						className="h-9 w-64 border-slate-200 bg-slate-50/50 pl-10 text-sm placeholder:text-slate-400 focus:border-[#E4002B] focus:ring-[#E4002B]/20"
					/>
				</div>

				<div className="hidden xl:block h-6 w-px bg-slate-200" />

				<RoleSwitcher />

				<NotificationsDropdown />

				<div className="h-6 w-px bg-slate-200" />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="relative h-9 gap-2 rounded-lg pl-1 pr-3 hover:bg-slate-100"
						>
							<Avatar className="h-8 w-8">
								<AvatarFallback className="bg-linear-to-br rounded-lg from-[#E4002B] to-[#B8001F] text-xs font-semibold text-white">
									{userInitials}
								</AvatarFallback>
							</Avatar>
							<span className="hidden text-sm font-medium text-slate-700 lg:inline-block">
								{userName.split(" ")[0]}
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-64">
						<DropdownMenuLabel>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-semibold">{userName}</p>
								<p className="text-xs font-medium text-slate-500">
									{rol === "gerencia"
										? "Gerencia Operaciones"
										: rol === "auditor"
											? "Auditor Interno"
											: "Comité de Auditoría"}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="cursor-pointer">
							<User className="mr-2 h-4 w-4" />
							Mi Perfil
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/login" className="cursor-pointer text-red-600 focus:text-red-600">
								<LogOut className="mr-2 h-4 w-4" />
								Cerrar Sesión
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
