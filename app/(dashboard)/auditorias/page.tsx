"use client"

import { useState, useMemo } from "react"
import { StatusBadge } from "@/components/status-badge"
import { CriticidadBadge } from "@/components/criticidad-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableCaption,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/context"
import { auditorias } from "@/lib/mock-data"
import type { Auditoria } from "@/lib/types"
import {
	FileSearch,
	Calendar,
	Building2,
	ClipboardList,
	AlertTriangle,
	CheckCircle2,
	Clock,
	X,
} from "lucide-react"
import Link from "next/link"
export default function AuditoriasPage() {
	const { planes, rol } = useApp()
	const [selectedAuditoria, setSelectedAuditoria] = useState<Auditoria | null>(null)
	const [dialogOpen, setDialogOpen] = useState(false)

	// Filtrar auditorías según rol
	const auditoriasVisibles = useMemo(() => {
		if (rol === "gerencia") {
			return auditorias.filter((a) => a.gerenciaAuditada === "Operaciones")
		}
		return auditorias
	}, [rol])

	// Calcular estadísticas por auditoría
	const getAuditoriaStats = (auditoriaId: string) => {
		const planesAuditoria = planes.filter((p) => p.auditoriaId === auditoriaId)
		return {
			total: planesAuditoria.length,
			pendientes: planesAuditoria.filter((p) => p.estadoCumplimiento === "pendiente").length,
			enImplementacion: planesAuditoria.filter((p) => p.estadoCumplimiento === "en_implementacion")
				.length,
			implementados: planesAuditoria.filter((p) => p.estadoCumplimiento === "implementado").length,
			vencidos: planesAuditoria.filter((p) => p.estadoCumplimiento === "vencido").length,
		}
	}

	const handleOpenAuditoria = (auditoria: Auditoria) => {
		setSelectedAuditoria(auditoria)
		setDialogOpen(true)
	}

	const planesAuditoriaSeleccionada = selectedAuditoria
		? planes.filter((p) => p.auditoriaId === selectedAuditoria.id)
		: []

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-6 p-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{auditoriasVisibles.map((auditoria) => {
						const stats = getAuditoriaStats(auditoria.id)
						const porcentajeImplementado =
							stats.total > 0 ? Math.round((stats.implementados / stats.total) * 100) : 0

						return (
							<Card
								key={auditoria.id}
								className="border-slate-200 gap-4 shadow-sm cursor-pointer transition-shadow hover:shadow-md"
								onClick={() => handleOpenAuditoria(auditoria)}
							>
								<CardHeader>
									<div className="flex items-start gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
											<FileSearch className="h-5 w-5" />
										</div>
										<div className="flex-1">
											<CardTitle className="text-base font-semibold leading-tight">
												{auditoria.nombre}
											</CardTitle>

											<div className="flex mt-1 items-center gap-4 text-sm text-muted-foreground justify-between">
												<CardDescription className="mt-1">{auditoria.id}</CardDescription>
												<div className="flex items-center gap-4 text-sm text-muted-foreground">
													<div className="flex items-center gap-1">
														<Calendar className="h-4 w-4" />
														<span>{new Date(auditoria.fecha).toLocaleDateString("es-CL")}</span>
													</div>
													<div className="flex items-center gap-1">
														<Building2 className="h-4 w-4" />
														<span>{auditoria.gerenciaAuditada}</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-1.5">
												<ClipboardList className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm font-medium">{stats.total} hallazgos</span>
											</div>
											<div className="text-right">
												<span className="text-lg font-bold text-primary">
													{porcentajeImplementado}%
												</span>
												<p className="text-xs text-muted-foreground">implementado</p>
											</div>
										</div>

										{/* Barra de progreso */}
										<div className="h-2 overflow-hidden rounded-full bg-slate-100">
											<div className="flex h-full">
												<div
													className="bg-green-500"
													style={{ width: `${(stats.implementados / stats.total) * 100}%` }}
												/>
												<div
													className="bg-blue-500"
													style={{ width: `${(stats.enImplementacion / stats.total) * 100}%` }}
												/>
												<div
													className="bg-slate-400"
													style={{ width: `${(stats.pendientes / stats.total) * 100}%` }}
												/>
												<div
													className="bg-red-500"
													style={{ width: `${(stats.vencidos / stats.total) * 100}%` }}
												/>
											</div>
										</div>

										{/* Estadísticas */}
										<div className="grid grid-cols-4 gap-2 text-center text-xs">
											<div>
												<div className="flex items-center justify-center gap-1 text-green-600">
													<CheckCircle2 className="h-3 w-3" />
													<span className="font-semibold">{stats.implementados}</span>
												</div>
												<span className="text-muted-foreground">Impl.</span>
											</div>
											<div>
												<div className="flex items-center justify-center gap-1 text-blue-600">
													<Clock className="h-3 w-3" />
													<span className="font-semibold">{stats.enImplementacion}</span>
												</div>
												<span className="text-muted-foreground">En proc.</span>
											</div>
											<div>
												<div className="flex items-center justify-center gap-1 text-slate-600">
													<ClipboardList className="h-3 w-3" />
													<span className="font-semibold">{stats.pendientes}</span>
												</div>
												<span className="text-muted-foreground">Pend.</span>
											</div>
											<div>
												<div className="flex items-center justify-center gap-1 text-red-600">
													<AlertTriangle className="h-3 w-3" />
													<span className="font-semibold">{stats.vencidos}</span>
												</div>
												<span className="text-muted-foreground">Venc.</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>

			{/* Dialog de detalle */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="p-0 sm:max-w-3xl sm:max-h-[min(650px,80vh)]">
					<DialogHeader className="pt-5 pb-3 m-0 border-b border-border">
						<DialogTitle className="px-6 text-base">{selectedAuditoria?.nombre}</DialogTitle>
						<DialogDescription className="px-6">
							{selectedAuditoria?.id} - {selectedAuditoria?.gerenciaAuditada} -{" "}
							{selectedAuditoria && new Date(selectedAuditoria.fecha).toLocaleDateString("es-CL")}
						</DialogDescription>
					</DialogHeader>

					<div className="px-6 pt-4">
						<p className="text-sm text-muted-foreground mb-4">{selectedAuditoria?.descripcion}</p>
					</div>

					<ScrollArea className="text-sm h-[480px] my-3 ps-6 pe-5 me-1">
						<Table>
							<TableCaption>
								Planes de acción asociados a la auditoría {selectedAuditoria?.nombre}
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[300px]">Hallazgo</TableHead>
									<TableHead>Criticidad</TableHead>
									<TableHead>Responsable</TableHead>
									<TableHead>Vencimiento</TableHead>
									<TableHead>Estado</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{planesAuditoriaSeleccionada.map((plan) => (
									<TableRow key={plan.id}>
										<TableCell className="font-medium">
											<Link
												href={`/planes?id=${plan.id}`}
												className="text-sm font-medium text-primary hover:underline"
												onClick={() => setDialogOpen(false)}
											>
												{plan.hallazgo}
											</Link>
										</TableCell>
										<TableCell>
											<CriticidadBadge criticidad={plan.criticidad} />
										</TableCell>
										<TableCell>{plan.responsablePlan}</TableCell>
										<TableCell>
											{new Date(plan.fechaVencimiento).toLocaleDateString("es-CL")}
										</TableCell>
										<TableCell>
											<StatusBadge estado={plan.estadoCumplimiento} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ScrollArea>

					<DialogFooter className="px-6 py-4 border-t border-border">
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cerrar
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
