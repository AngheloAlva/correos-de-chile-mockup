"use client"

import { useState } from "react"
import {
	Sheet,
	SheetBody,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import { CriticidadBadge } from "@/components/criticidad-badge"
import { useApp } from "@/lib/context"
import type { PlanDeAccion, EstadoCumplimiento } from "@/lib/types"
import { estadosLabels } from "@/lib/mock-data"
import { toast } from "sonner"
import {
	FileText,
	Calendar,
	User,
	Building2,
	Clock,
	Upload,
	MessageSquare,
	CheckCircle2,
	AlertCircle,
} from "lucide-react"

interface PlanDetailSheetProps {
	plan: PlanDeAccion | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function PlanDetailSheet({ plan, open, onOpenChange }: PlanDetailSheetProps) {
	const { rol, actividades, actualizarEstadoPlan, agregarActividad, agregarEvidencia } = useApp()
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
	const [nuevoEstado, setNuevoEstado] = useState<EstadoCumplimiento>("en_implementacion")
	const [comentario, setComentario] = useState("")
	const [nombreEvidencia, setNombreEvidencia] = useState("")

	if (!plan) return null

	const actividadesPlan = actividades
		.filter((a) => a.planId === plan.id)
		.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

	const handleActualizarAvance = () => {
		actualizarEstadoPlan(plan.id, nuevoEstado)
		agregarActividad({
			planId: plan.id,
			fecha: new Date().toISOString().split("T")[0],
			usuario: rol === "gerencia" ? "María González" : "Ana Martínez",
			rol: rol,
			accion: `Actualizó estado a ${estadosLabels[nuevoEstado]}`,
			comentario: comentario || undefined,
		})
		if (nombreEvidencia) {
			agregarEvidencia(plan.id, {
				id: `EV-${Date.now()}`,
				nombre: nombreEvidencia,
				tipo: nombreEvidencia.split(".").pop()?.toUpperCase() || "DOC",
				tamaño: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}MB`,
				fechaCarga: new Date().toISOString().split("T")[0],
				cargadoPor: rol === "gerencia" ? "María González" : "Ana Martínez",
			})
			agregarActividad({
				planId: plan.id,
				fecha: new Date().toISOString().split("T")[0],
				usuario: rol === "gerencia" ? "María González" : "Ana Martínez",
				rol: rol,
				accion: `Cargó evidencia: ${nombreEvidencia}`,
			})
		}
		toast.success("Avance actualizado correctamente")
		setUpdateDialogOpen(false)
		setComentario("")
		setNombreEvidencia("")
	}

	const handleValidar = (accion: "implementado" | "observado") => {
		const nuevoEstadoValidacion =
			accion === "implementado" ? "implementado" : plan.estadoCumplimiento
		if (accion === "implementado") {
			actualizarEstadoPlan(plan.id, "implementado")
		}
		agregarActividad({
			planId: plan.id,
			fecha: new Date().toISOString().split("T")[0],
			usuario: "Ana Martínez",
			rol: "auditor",
			accion: accion === "implementado" ? "Validó implementación" : "Marcó como Observado",
			comentario: comentario || undefined,
		})
		toast.success(
			accion === "implementado" ? "Plan validado como implementado" : "Observación registrada"
		)
		setReviewDialogOpen(false)
		setComentario("")
	}

	const canEdit = rol === "gerencia" || rol === "auditor"
	const canValidate = rol === "auditor"
	const isComite = rol === "comite"

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-full sm:max-w-xl">
				<SheetHeader>
					<div className="flex items-start gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<FileText className="h-5 w-5" />
						</div>
						<div className="flex-1">
							<SheetTitle className="text-left">{plan.hallazgo}</SheetTitle>
							<SheetDescription className="text-left">
								{plan.id} - {plan.nombreInforme}
							</SheetDescription>
						</div>
					</div>
				</SheetHeader>

				<SheetBody>
					<ScrollArea className="h-[calc(100vh-16rem)] pr-4">
						<div className="space-y-6 py-4">
							{/* Estado y Criticidad */}
							<div className="flex items-center gap-3">
								<StatusBadge estado={plan.estadoCumplimiento} />
								<CriticidadBadge criticidad={plan.criticidad} />
							</div>

							{/* Información General */}
							<div className="space-y-4">
								<h4 className="text-sm font-semibold">Información del Hallazgo</h4>
								<div className="grid gap-3 rounded-lg border p-4">
									<div className="flex items-start gap-3">
										<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-xs text-muted-foreground">Fecha del Informe</p>
											<p className="text-sm">
												{new Date(plan.fechaInforme).toLocaleDateString("es-CL", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
										</div>
									</div>
									<Separator />
									<div>
										<p className="text-xs text-muted-foreground mb-1">Descripción del Hallazgo</p>
										<p className="text-sm leading-relaxed">{plan.hallazgoDescripcion}</p>
									</div>
								</div>
							</div>

							{/* Plan de Acción */}
							<div className="space-y-4">
								<h4 className="text-sm font-semibold">Plan de Acción</h4>
								<div className="grid gap-3 rounded-lg border p-4">
									<p className="text-sm leading-relaxed">{plan.planAccion}</p>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<div className="flex items-start gap-2">
											<User className="h-4 w-4 text-muted-foreground mt-0.5" />
											<div>
												<p className="text-xs text-muted-foreground">Responsable</p>
												<p className="text-sm font-medium">{plan.responsablePlan}</p>
											</div>
										</div>
										<div className="flex items-start gap-2">
											<Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
											<div>
												<p className="text-xs text-muted-foreground">Gerencia</p>
												<p className="text-sm font-medium">{plan.gerencia}</p>
											</div>
										</div>
									</div>
									<div className="flex items-start gap-2">
										<Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-xs text-muted-foreground">Fecha de Vencimiento</p>
											<p className="text-sm font-medium">
												{new Date(plan.fechaVencimiento).toLocaleDateString("es-CL", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
										</div>
									</div>
									<div className="flex items-start gap-2">
										<User className="h-4 w-4 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-xs text-muted-foreground">Auditor Responsable</p>
											<p className="text-sm font-medium">{plan.responsableAuditoria}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Evidencias */}
							<div className="space-y-4">
								<h4 className="text-sm font-semibold">Evidencias ({plan.evidencias.length})</h4>
								{plan.evidencias.length === 0 ? (
									<div className="rounded-lg border border-dashed p-6 text-center">
										<Upload className="mx-auto h-8 w-8 text-muted-foreground" />
										<p className="mt-2 text-sm text-muted-foreground">No hay evidencias cargadas</p>
									</div>
								) : (
									<div className="space-y-2">
										{plan.evidencias.map((ev) => (
											<div
												key={ev.id}
												className="flex items-center justify-between rounded-lg border p-3"
											>
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
														<FileText className="h-5 w-5 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm font-medium">{ev.nombre}</p>
														<p className="text-xs text-muted-foreground">
															{ev.tipo} - {ev.tamaño} - {ev.cargadoPor}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Timeline de Actividades */}
							<div className="space-y-4">
								<h4 className="text-sm font-semibold">Historial de Seguimiento</h4>
								{actividadesPlan.length === 0 ? (
									<p className="text-sm text-muted-foreground">No hay actividades registradas</p>
								) : (
									<div className="space-y-4">
										{actividadesPlan.map((act) => (
											<div key={act.id} className="flex gap-3">
												<div className="flex flex-col items-center">
													<div
														className={`flex h-8 w-8 items-center justify-center rounded-full ${
															act.rol === "auditor"
																? "bg-blue-100 text-blue-600"
																: "bg-primary/10 text-primary"
														}`}
													>
														{act.rol === "auditor" ? (
															<CheckCircle2 className="h-4 w-4" />
														) : (
															<MessageSquare className="h-4 w-4" />
														)}
													</div>
													<div className="w-px flex-1 bg-border" />
												</div>
												<div className="flex-1 pb-4">
													<div className="flex items-center gap-2">
														<p className="text-sm font-medium">{act.usuario}</p>
														<span className="text-xs text-muted-foreground capitalize">
															({act.rol})
														</span>
													</div>
													<p className="text-sm text-muted-foreground">{act.accion}</p>
													{act.comentario && (
														<p className="mt-1 text-sm italic text-muted-foreground">
															&ldquo;{act.comentario}&rdquo;
														</p>
													)}
													<p className="mt-1 text-xs text-muted-foreground">
														{new Date(act.fecha).toLocaleDateString("es-CL", {
															year: "numeric",
															month: "short",
															day: "numeric",
														})}
													</p>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</ScrollArea>
				</SheetBody>

				{!isComite && (
					<SheetFooter className="gap-2 sm:gap-0">
						{canEdit && (
							<Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
								<DialogTrigger asChild>
									<Button className="w-full sm:w-auto">
										<Upload className="mr-2 h-4 w-4" />
										Actualizar Avance
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Actualizar Avance</DialogTitle>
										<DialogDescription>Registra el progreso del plan de acción</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label>Nuevo Estado</Label>
											<Select
												value={nuevoEstado}
												onValueChange={(v) => setNuevoEstado(v as EstadoCumplimiento)}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="pendiente">Pendiente</SelectItem>
													<SelectItem value="en_implementacion">En Implementación</SelectItem>
													<SelectItem value="implementado">Implementado</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label>Comentario (opcional)</Label>
											<Textarea
												placeholder="Describe el avance realizado..."
												value={comentario}
												onChange={(e) => setComentario(e.target.value)}
											/>
										</div>
										<div className="space-y-2">
											<Label>Adjuntar Evidencia (opcional)</Label>
											<Input
												placeholder="nombre_archivo.pdf"
												value={nombreEvidencia}
												onChange={(e) => setNombreEvidencia(e.target.value)}
											/>
											<p className="text-xs text-muted-foreground">
												Simula el nombre del archivo a adjuntar
											</p>
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
											Cancelar
										</Button>
										<Button onClick={handleActualizarAvance}>Guardar Avance</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}

						{canValidate && (
							<Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
								<DialogTrigger asChild>
									<Button variant="outline" className="w-full sm:w-auto">
										<CheckCircle2 className="mr-2 h-4 w-4" />
										Revisar / Validar
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Revisión del Auditor</DialogTitle>
										<DialogDescription>
											Valida o marca como observado el plan de acción
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label>Comentario del Auditor</Label>
											<Textarea
												placeholder="Observaciones de la revisión..."
												value={comentario}
												onChange={(e) => setComentario(e.target.value)}
											/>
										</div>
									</div>
									<DialogFooter className="gap-2 sm:gap-0">
										<Button variant="outline" onClick={() => handleValidar("observado")}>
											<AlertCircle className="mr-2 h-4 w-4" />
											Marcar Observado
										</Button>
										<Button onClick={() => handleValidar("implementado")}>
											<CheckCircle2 className="mr-2 h-4 w-4" />
											Validar Implementación
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	)
}
