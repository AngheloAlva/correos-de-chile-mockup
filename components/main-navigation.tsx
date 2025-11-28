"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuPositioner,
	NavigationMenuPopup,
	NavigationMenuTrigger,
} from "@/components/ui/base-navigation-menu"
import { useApp } from "@/lib/context"
import {
	LayoutDashboard,
	ClipboardList,
	FileSearch,
	BarChart3,
	Settings,
	TrendingUp,
	AlertTriangle,
	CheckCircle2,
} from "lucide-react"

const reportesSubmenu = [
	{
		title: "Resumen General",
		href: "/reportes?tab=resumen",
		description: "Vista ejecutiva con KPIs y métricas principales",
		icon: TrendingUp,
	},
	{
		title: "Por Gerencia",
		href: "/reportes?tab=gerencias",
		description: "Análisis comparativo entre gerencias",
		icon: BarChart3,
	},
	{
		title: "Por Auditoría",
		href: "/reportes?tab=auditorias",
		description: "Estado de planes agrupados por informe de auditoría",
		icon: FileSearch,
	},
	{
		title: "Tendencias",
		href: "/reportes?tab=tendencias",
		description: "Evolución temporal y proyecciones",
		icon: TrendingUp,
	},
]

const planesSubmenu = [
	{
		title: "Todos los Planes",
		href: "/planes",
		description: "Vista completa de todos los planes de acción",
		icon: ClipboardList,
	},
	{
		title: "Pendientes",
		href: "/planes?estado=pendiente",
		description: "Planes que aún no han iniciado implementación",
		icon: AlertTriangle,
	},
	{
		title: "Implementados",
		href: "/planes?estado=implementado",
		description: "Planes completados y validados",
		icon: CheckCircle2,
	},
]

const menuItemStyles =
	"group flex flex-row h-10 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2.5 text-sm font-medium transition-all hover:bg-slate-100 hover:text-[#E4002B] focus:bg-slate-100 focus:text-[#E4002B] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[popup-open]:bg-slate-100 data-[popup-open]:text-[#E4002B]"

export function MainNavigation() {
	const { rol } = useApp()

	const showConfig = rol !== "comite"

	return (
		<NavigationMenu>
			<NavigationMenuList className="gap-1">
				<NavigationMenuItem>
					<NavigationMenuLink render={<Link href="/" className={menuItemStyles} />}>
						<LayoutDashboard className="mr-1 h-4 w-4" />
						Dashboard
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger className={menuItemStyles}>
						<ClipboardList className="mr-1 h-4 w-4" />
						Planes de Acción
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[420px] gap-1 p-3">
							{planesSubmenu.map((item) => (
								<ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>
									{item.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger className={menuItemStyles}>
						<BarChart3 className="mr-1 h-4 w-4" />
						Reportes
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[520px] gap-1 p-3 md:grid-cols-2">
							{reportesSubmenu.map((item) => (
								<ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>
									{item.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink render={<Link href="/auditorias" className={menuItemStyles} />}>
						<FileSearch className="mr-1 h-4 w-4" />
						Auditorías
					</NavigationMenuLink>
				</NavigationMenuItem>

				{showConfig && (
					<NavigationMenuItem>
						<NavigationMenuLink render={<Link href="/configuracion" className={menuItemStyles} />}>
							<Settings className="mr-1 h-4 w-4" />
							Configuración
						</NavigationMenuLink>
					</NavigationMenuItem>
				)}
			</NavigationMenuList>
			<NavigationMenuPositioner>
				<NavigationMenuPopup />
			</NavigationMenuPositioner>
		</NavigationMenu>
	)
}

function ListItem({
	title,
	children,
	href,
	icon: Icon,
	...props
}: React.ComponentPropsWithoutRef<"li"> & {
	href: string
	icon?: React.ElementType
}) {
	return (
		<li {...props}>
			<NavigationMenuLink
				render={
					<Link
						href={href}
						className="group block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-50 hover:text-[#E4002B] focus:bg-slate-50 focus:text-[#E4002B]"
					/>
				}
			>
				<div className="flex items-start gap-3">
					{Icon && (
						<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E4002B]/5 text-[#E4002B] transition-colors group-hover:bg-[#E4002B]/10">
							<Icon className="h-5 w-5" />
						</div>
					)}
					<div className="flex-1">
						<div className="mb-1 text-sm font-semibold leading-none group-hover:text-[#E4002B]">
							{title}
						</div>
						<p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{children}</p>
					</div>
				</div>
			</NavigationMenuLink>
		</li>
	)
}
