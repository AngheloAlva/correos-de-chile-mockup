"use client"

import { useState, useMemo } from "react"
import { StatusBadge } from "@/components/status-badge"
import { CriticidadBadge } from "@/components/criticidad-badge"
import { PlanDetailSheet } from "@/components/plan-detail-sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { TableCaption } from "@/components/ui/table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useApp } from "@/lib/context"
import type { PlanDeAccion } from "@/lib/types"
import { gerencias, estadosLabels, criticidadLabels } from "@/lib/mock-data"
import { Search, Filter, X, ChevronRight, FilterX, CalendarX, User, Building2 } from "lucide-react"

export default function PlanesPage() {
	const { planes, rol } = useApp()
	const [selectedPlan, setSelectedPlan] = useState<PlanDeAccion | null>(null)
	const [sheetOpen, setSheetOpen] = useState(false)

	const [searchQuery, setSearchQuery] = useState("")
	const [filtroGerencia, setFiltroGerencia] = useState<string>("todas")
	const [filtroEstado, setFiltroEstado] = useState<string>("todos")
	const [filtroCriticidad, setFiltroCriticidad] = useState<string>("todas")
	const [filtroAuditor, setFiltroAuditor] = useState<string>("todos")

	const planesFiltrados = useMemo(() => {
		let resultado = [...planes]

		if (rol === "gerencia") {
			resultado = resultado.filter((p) => p.gerencia === "Operaciones")
		} else if (rol === "auditor") {
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase()
			resultado = resultado.filter(
				(p) =>
					p.hallazgo.toLowerCase().includes(query) ||
					p.nombreInforme.toLowerCase().includes(query) ||
					p.planAccion.toLowerCase().includes(query)
			)
		}

		if (filtroGerencia !== "todas") {
			resultado = resultado.filter((p) => p.gerencia === filtroGerencia)
		}

		if (filtroEstado !== "todos") {
			resultado = resultado.filter((p) => p.estadoCumplimiento === filtroEstado)
		}

		if (filtroCriticidad !== "todas") {
			resultado = resultado.filter((p) => p.criticidad === filtroCriticidad)
		}

		if (filtroAuditor !== "todos") {
			resultado = resultado.filter((p) => p.responsableAuditoria === filtroAuditor)
		}

		return resultado
	}, [planes, rol, searchQuery, filtroGerencia, filtroEstado, filtroCriticidad, filtroAuditor])

	const auditores = [...new Set(planes.map((p) => p.responsableAuditoria))]

	const handleOpenPlan = (plan: PlanDeAccion) => {
		setSelectedPlan(plan)
		setSheetOpen(true)
	}

	const clearFilters = () => {
		setSearchQuery("")
		setFiltroGerencia("todas")
		setFiltroEstado("todos")
		setFiltroCriticidad("todas")
		setFiltroAuditor("todos")
	}

	const hasActiveFilters =
		searchQuery ||
		filtroGerencia !== "todas" ||
		filtroEstado !== "todos" ||
		filtroCriticidad !== "todas" ||
		filtroAuditor !== "todos"

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-6 p-6">
				<Card className="border-slate-200 shadow-sm">
					<CardContent className=" space-y-2">
						<div>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
								<Input
									placeholder="Buscar por hallazgo, informe o plan..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="h-11 pl-11 text-sm border-slate-200 focus:border-[#E4002B] focus:ring-[#E4002B]/20"
								/>
							</div>
						</div>

						<div className=" h-px bg-slate-200" />

						<div className="space-y-4">
							<div className="flex items-center justify-between gap-3">
								<div className="flex flex-wrap items-center gap-3">
									<Select
										value={filtroGerencia}
										onValueChange={setFiltroGerencia}
										disabled={rol === "gerencia"}
									>
										<SelectTrigger className="h-9 min-w-[160px] border-slate-200 text-sm">
											<SelectValue placeholder="Gerencia" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todas">Todas</SelectItem>
											{gerencias.map((g) => (
												<SelectItem key={g} value={g}>
													{g}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Select value={filtroEstado} onValueChange={setFiltroEstado}>
										<SelectTrigger className="h-9 min-w-[180px] border-slate-200 text-sm">
											<SelectValue placeholder="Estado" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											{Object.entries(estadosLabels).map(([key, label]) => (
												<SelectItem key={key} value={key}>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Select value={filtroCriticidad} onValueChange={setFiltroCriticidad}>
										<SelectTrigger className="h-9 min-w-[150px] border-slate-200 text-sm">
											<SelectValue placeholder="Criticidad" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todas">Todas</SelectItem>
											{Object.entries(criticidadLabels).map(([key, label]) => (
												<SelectItem key={key} value={key}>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Select value={filtroAuditor} onValueChange={setFiltroAuditor}>
										<SelectTrigger className="h-9 min-w-[170px] border-slate-200 text-sm">
											<SelectValue placeholder="Auditor" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											{auditores.map((a) => (
												<SelectItem key={a} value={a}>
													{a}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="flex items-center  gap-4 pt-2">
									{hasActiveFilters && (
										<Button
											variant="outline"
											size="sm"
											onClick={clearFilters}
											className="h-9 border-slate-200 text-sm hover:bg-slate-50 hover:border-[#E4002B] hover:text-[#E4002B]"
										>
											<FilterX className="mr-2 h-4 w-4" />
											Limpiar filtros
										</Button>
									)}

									<div className="flex items-center gap-2">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
											<Filter className="h-4 w-4 text-slate-600" />
										</div>
										<div>
											<p className="text-sm font-semibold text-slate-900">
												{planesFiltrados.length} de {planes.length} planes
											</p>
											<p className="text-xs text-slate-500">resultados encontrados</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-slate-200 shadow-sm pt-0">
					<CardContent className="p-0">
						<Table>
							<TableCaption>
								Lista de planes de acción de auditorías. {planesFiltrados.length} de {planes.length}{" "}
								planes mostrados.
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[200px]">Informe</TableHead>
									<TableHead>Hallazgo</TableHead>
									<TableHead>Criticidad</TableHead>
									<TableHead>Gerencia</TableHead>
									<TableHead>Responsable</TableHead>
									<TableHead>Vencimiento</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead className="w-[50px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{planesFiltrados.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
											No se encontraron planes de acción con los filtros seleccionados
										</TableCell>
									</TableRow>
								) : (
									planesFiltrados.map((plan) => (
										<TableRow
											key={plan.id}
											className="cursor-pointer hover:bg-muted/50"
											onClick={() => handleOpenPlan(plan)}
										>
											<TableCell className="font-medium">
												<div>
													<p className="text-sm font-medium truncate max-w-[180px]">
														{plan.nombreInforme}
													</p>
													<p className="text-xs text-muted-foreground">
														{new Date(plan.fechaInforme).toLocaleDateString("es-CL")}
													</p>
												</div>
											</TableCell>
											<TableCell className="max-w-[250px]">
												<p className="text-sm truncate">{plan.hallazgo}</p>
											</TableCell>
											<TableCell>
												<CriticidadBadge criticidad={plan.criticidad} />
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Building2 className="size-4 text-muted-foreground" />
													{plan.gerencia}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<User className="size-4 text-muted-foreground" />
													{plan.responsablePlan}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<CalendarX className="size-4 text-muted-foreground" />
													{new Date(plan.fechaVencimiento).toLocaleDateString("es-CL")}
												</div>
											</TableCell>
											<TableCell>
												<StatusBadge estado={plan.estadoCumplimiento} />
											</TableCell>
											<TableCell>
												<ChevronRight className="h-4 w-4 text-muted-foreground" />
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			<PlanDetailSheet plan={selectedPlan} open={sheetOpen} onOpenChange={setSheetOpen} />
		</div>
	)
}
