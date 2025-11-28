"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useApp } from "@/lib/context"
import { Bell, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"

export function NotificationsDropdown() {
	const { notificaciones, marcarNotificacionLeida } = useApp()
	const unreadCount = notificaciones.filter((n) => !n.leida).length

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative h-9 w-9 rounded-lg hover:bg-slate-100"
				>
					<Bell className="h-5 w-5 text-slate-600" />
					{unreadCount > 0 && (
						<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#E4002B] to-[#B8001F] text-[10px] font-bold text-white shadow-md">
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-96">
				<DropdownMenuLabel className="flex items-center justify-between border-b pb-3">
					<span className="font-semibold">Notificaciones</span>
					{unreadCount > 0 && (
						<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
							{unreadCount} {unreadCount === 1 ? "nueva" : "nuevas"}
						</span>
					)}
				</DropdownMenuLabel>
				<ScrollArea className="h-[350px]">
					{notificaciones.length === 0 ? (
						<div className="flex flex-col items-center justify-center p-8 text-center">
							<Bell className="mb-3 h-12 w-12 text-slate-300" />
							<p className="text-sm font-medium text-slate-600">No hay notificaciones</p>
							<p className="mt-1 text-xs text-slate-400">Te notificaremos cuando haya novedades</p>
						</div>
					) : (
						<div className="divide-y">
							{notificaciones.map((notif) => (
								<DropdownMenuItem key={notif.id} asChild className="p-0">
									<Link
										href={`/planes?id=${notif.planId}`}
										className="flex cursor-pointer gap-3 p-4 transition-colors hover:bg-slate-50"
										onClick={() => marcarNotificacionLeida(notif.id)}
									>
										<div
											className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
												notif.tipo === "vencido"
													? "bg-red-50 text-red-600"
													: "bg-amber-50 text-amber-600"
											}`}
										>
											{notif.tipo === "vencido" ? (
												<AlertTriangle className="h-5 w-5" />
											) : (
												<Clock className="h-5 w-5" />
											)}
										</div>
										<div className="flex-1 space-y-1">
											<p
												className={`text-sm leading-tight ${!notif.leida ? "font-semibold text-slate-900" : "text-slate-600"}`}
											>
												{notif.mensaje}
											</p>
											<p className="text-xs font-medium text-slate-400">{notif.planId}</p>
										</div>
										{!notif.leida && (
											<div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#E4002B]" />
										)}
									</Link>
								</DropdownMenuItem>
							))}
						</div>
					)}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
