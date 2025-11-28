"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
	Clock,
	Loader2,
	CheckCircle2,
	AlertTriangle,
	CalendarClock,
	ClipboardList,
	Calendar,
	CalendarX,
	Building,
	Building2,
} from "lucide-react"

import { useApp } from "@/lib/context"

import { CriticidadBadge } from "@/components/criticidad-badge"
import { StatusBadge } from "@/components/status-badge"
import { CardKpi } from "@/components/card-kpi"
import { CriticidadChart, EstadosPorGerenciaChart } from "@/components/dashboard-charts"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import {
	Table,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableCaption,
} from "@/components/ui/table"

export default function DashboardPage() {
	const { planes, rol, gerenciaActual } = useApp()

	const planesVisibles = useMemo(() => {
		if (rol === "gerencia") {
			return planes.filter((p) => p.gerencia === "Operaciones")
		}
		return planes
	}, [planes, rol])

	const kpis = useMemo(() => {
		const total = planesVisibles.length
		const pendientes = planesVisibles.filter((p) => p.estadoCumplimiento === "pendiente").length
		const enImplementacion = planesVisibles.filter(
			(p) => p.estadoCumplimiento === "en_implementacion"
		).length
		const implementados = planesVisibles.filter(
			(p) => p.estadoCumplimiento === "implementado"
		).length
		const vencidos = planesVisibles.filter((p) => p.estadoCumplimiento === "vencido").length

		return { total, pendientes, enImplementacion, implementados, vencidos }
	}, [planesVisibles])

	const proximosVencer = useMemo(() => {
		const hoy = new Date()
		return planesVisibles
			.filter((p) => p.estadoCumplimiento !== "implementado" && p.estadoCumplimiento !== "vencido")
			.map((p) => ({
				...p,
				diasRestantes: Math.ceil(
					(new Date(p.fechaVencimiento).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
				),
			}))
			.sort((a, b) => a.diasRestantes - b.diasRestantes)
			.slice(0, 4)
	}, [planesVisibles])

	const planesAuditor = useMemo(() => {
		if (rol !== "auditor") return []
		return planes.filter((p) => p.responsableAuditoria === "Ana Martínez").slice(0, 5)
	}, [planes, rol])

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-6 p-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
					<CardKpi title="Total Planes" value={kpis.total} icon={ClipboardList} variant="primary" />
					<CardKpi title="Pendientes" value={kpis.pendientes} icon={Clock} variant="default" />
					<CardKpi
						title="En Implementación"
						value={kpis.enImplementacion}
						icon={Loader2}
						variant="primary"
					/>
					<CardKpi
						title="Implementados"
						value={kpis.implementados}
						icon={CheckCircle2}
						variant="success"
					/>
					<CardKpi title="Vencidos" value={kpis.vencidos} icon={AlertTriangle} variant="danger" />
				</div>

				<div className={`grid gap-4 ${rol === "comite" ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
					<CriticidadChart planes={planesVisibles} />
					<EstadosPorGerenciaChart planes={planesVisibles} />

					{rol !== "comite" && (
						<Card className="border-slate-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-base font-semibold flex items-center gap-2">
									Próximos a Vencer
								</CardTitle>
								<CardDescription>Planes que requieren atención inmediata</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{proximosVencer.length === 0 ? (
										<p className="text-sm text-muted-foreground py-4 text-center">
											No hay planes próximos a vencer
										</p>
									) : (
										proximosVencer.map((plan) => (
											<Link
												key={plan.id}
												href={`/planes?id=${plan.id}`}
												className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
											>
												<div className="space-y-1">
													<p className="text-sm font-medium leading-tight">{plan.hallazgo}</p>
													<p className="text-xs text-muted-foreground">{plan.gerencia}</p>
												</div>
												<div className="text-right">
													<p
														className={`text-sm font-semibold ${
															plan.diasRestantes <= 3
																? "text-red-600"
																: plan.diasRestantes <= 7
																	? "text-amber-600"
																	: "text-slate-600"
														}`}
													>
														{plan.diasRestantes} días
													</p>
													<CriticidadBadge criticidad={plan.criticidad} />
												</div>
											</Link>
										))
									)}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{rol !== "comite" && (
					<Card className="border-slate-200 shadow-sm gap-2">
						<CardHeader>
							<CardTitle className="text-base font-semibold">
								{rol === "auditor" ? "Planes Asignados a Ti" : "Resumen de Planes"}
							</CardTitle>
							<CardDescription>
								{rol === "auditor"
									? "Planes de acción donde eres el auditor responsable"
									: "Vista general de los planes de acción activos"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableCaption>
									{rol === "auditor"
										? "Planes de acción donde eres el auditor responsable"
										: "Vista general de los planes de acción activos"}
								</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[300px]">Hallazgo</TableHead>
										<TableHead>Gerencia</TableHead>
										<TableHead>Criticidad</TableHead>
										<TableHead>Vencimiento</TableHead>
										<TableHead>Estado</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(rol === "auditor" ? planesAuditor : proximosVencer).map((plan) => (
										<TableRow key={plan.id} className="cursor-pointer hover:bg-muted/50">
											<TableCell className="font-medium max-w-[200px] truncate">
												{plan.hallazgo}
											</TableCell>
											<TableCell className="flex items-center gap-1">
												<Building2 className="size-4 text-slate-500" />
												{plan.gerencia}
											</TableCell>
											<TableCell>
												<CriticidadBadge criticidad={plan.criticidad} />
											</TableCell>
											<TableCell className="flex items-center gap-1">
												<CalendarX className="size-4 text-slate-500" />
												{new Date(plan.fechaVencimiento).toLocaleDateString("es-CL")}
											</TableCell>
											<TableCell>
												<StatusBadge estado={plan.estadoCumplimiento} />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}

				{rol === "comite" && (
					<div className="grid gap-6 lg:grid-cols-2">
						<Card className="border-slate-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-base font-semibold">Resumen Ejecutivo</CardTitle>
								<CardDescription>Indicadores clave de desempeño</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between border-b pb-3">
										<span className="text-sm text-muted-foreground">Tasa de Implementación</span>
										<span className="text-lg font-bold text-green-600">
											{kpis.total > 0 ? Math.round((kpis.implementados / kpis.total) * 100) : 0}%
										</span>
									</div>
									<div className="flex items-center justify-between border-b pb-3">
										<span className="text-sm text-muted-foreground">Planes en Riesgo</span>
										<span className="text-lg font-bold text-amber-600">
											{proximosVencer.filter((p) => p.diasRestantes <= 7).length}
										</span>
									</div>
									<div className="flex items-center justify-between border-b pb-3">
										<span className="text-sm text-muted-foreground">Planes Vencidos</span>
										<span className="text-lg font-bold text-red-600">{kpis.vencidos}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Criticidad Alta Pendiente</span>
										<span className="text-lg font-bold text-red-600">
											{
												planesVisibles.filter(
													(p) => p.criticidad === "alta" && p.estadoCumplimiento !== "implementado"
												).length
											}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border-slate-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-base font-semibold">Alertas Críticas</CardTitle>
								<CardDescription>Situaciones que requieren atención</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{planesVisibles
										.filter(
											(p) =>
												p.estadoCumplimiento === "vencido" ||
												(p.criticidad === "alta" && p.estadoCumplimiento !== "implementado")
										)
										.slice(0, 4)
										.map((plan) => (
											<div
												key={plan.id}
												className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3"
											>
												<AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
												<div className="flex-1">
													<p className="text-sm font-medium">{plan.hallazgo}</p>
													<p className="text-xs text-muted-foreground">
														{plan.gerencia} -{" "}
														{plan.estadoCumplimiento === "vencido" ? "Vencido" : "Alta criticidad"}
													</p>
												</div>
											</div>
										))}
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	)
}
