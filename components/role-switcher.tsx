"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/base-select"
import { useApp } from "@/lib/context"
import type { UserRole } from "@/lib/types"
import { UserCog, UserCheck, Users } from "lucide-react"

const roleItems = [
	{
		label: "Gerencia",
		value: "gerencia" as UserRole,
		icon: UserCog,
	},
	{
		label: "Auditor Interno",
		value: "auditor" as UserRole,
		icon: UserCheck,
	},
	{
		label: "Comité / Alta Dirección",
		value: "comite" as UserRole,
		icon: Users,
	},
]

export function RoleSwitcher() {
	const { rol, setRol } = useApp()

	const currentRole = roleItems.find((item) => item.value === rol)

	return (
		<div className="flex items-center gap-2">
			<Select
				items={roleItems}
				value={rol}
				onValueChange={(value) => setRol(value as UserRole)}
				indicatorPosition="left"
			>
				<SelectTrigger className="h-9 w-[200px] border-slate-200 bg-white text-sm hover:border-[#E4002B] focus:ring-[#E4002B]/20">
					<div className="flex items-center gap-2.5">
						{currentRole && <currentRole.icon className="h-4 w-4 text-slate-600" />}
						<SelectValue placeholder="Seleccionar rol" />
					</div>
				</SelectTrigger>
				<SelectContent className="w-[200px] py-2" sideOffset={4}>
					{roleItems.map((item) => (
						<SelectItem
							key={item.value}
							value={item.value}
							className="cursor-pointer px-4 py-2.5 mx-1 rounded-md"
						>
							<span className="flex items-center gap-2.5">
								<item.icon className="h-4 w-4 shrink-0 text-slate-600" />
								<span className="font-medium text-slate-900">{item.label}</span>
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
