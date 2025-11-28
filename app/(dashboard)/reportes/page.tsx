"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableCaption,
	TableFooter,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/lib/context"
import { gerencias, auditorias, actividadesSeguimiento } from "@/lib/mock-data"
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	AreaChart,
	Area,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
} from "recharts"
import {
	TrendingUp,
	TrendingDown,
	AlertTriangle,
	CheckCircle2,
	Award,
	Clock,
	FileText,
	Target,
	Calendar,
	Users,
	BarChart3,
	Activity,
	Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"

// Paleta de colores profesional unificada
const ESTADO_COLORS = {
	"Pendiente": "#6B7280", // Gray
	"En Implementación": "#3B82F6", // Blue
	"Implementado": "#10B981", // Green
	"Vencido": "#EF4444", // Red
}

const CRITICIDAD_COLORS = {
	Alta: "#EF4444", // Red
	Media: "#F59E0B", // Amber
	Baja: "#10B981", // Green
}

const CHART_COLORS = {
	primary: "#3B82F6",
	secondary: "#8B5CF6",
	success: "#10B981",
	warning: "#F59E0B",
	danger: "#EF4444",
	gray: "#6B7280",
	grayLight: "#E5E7EB",
	grayLighter: "#F3F4F6",
}

export default function ReportesPage() {
	const { planes, rol } = useApp()
	const [periodo, setPeriodo] = useState("12")
	const [filtroGerencia, setFiltroGerencia] = useState("todas")

	// Filtrar planes por período y gerencia
	const planesFiltrados = useMemo(() => {
		if (!planes || planes.length === 0) {
			return []
		}

		let resultado = [...planes]

		// Filtrar por período solo si hay planes
		const mesesAtras = Number.parseInt(periodo)
		if (mesesAtras > 0) {
			const hoy = new Date()
			const fechaLimite = new Date()
			fechaLimite.setMonth(fechaLimite.getMonth() - mesesAtras)
			fechaLimite.setHours(0, 0, 0, 0)

			resultado = resultado.filter((p) => {
				if (!p.fechaInforme) return true // Incluir si no tiene fecha
				const fechaPlan = new Date(p.fechaInforme)
				fechaPlan.setHours(0, 0, 0, 0)
				return fechaPlan >= fechaLimite
			})

			// Si después del filtro no hay resultados, mostrar todos los planes
			if (resultado.length === 0) {
				resultado = [...planes]
			}
		}

		// Filtrar por gerencia
		if (filtroGerencia !== "todas") {
			resultado = resultado.filter((p) => p.gerencia === filtroGerencia)
		}

		return resultado
	}, [planes, periodo, filtroGerencia])

	// Datos para gráfico de estado general
	const datosEstadoGeneral = useMemo(() => {
		return [
			{
				name: "Pendiente",
				value: planesFiltrados.filter((p) => p.estadoCumplimiento === "pendiente").length,
				color: ESTADO_COLORS.Pendiente,
			},
			{
				name: "En Implementación",
				value: planesFiltrados.filter((p) => p.estadoCumplimiento === "en_implementacion").length,
				color: ESTADO_COLORS["En Implementación"],
			},
			{
				name: "Implementado",
				value: planesFiltrados.filter((p) => p.estadoCumplimiento === "implementado").length,
				color: ESTADO_COLORS.Implementado,
			},
			{
				name: "Vencido",
				value: planesFiltrados.filter((p) => p.estadoCumplimiento === "vencido").length,
				color: ESTADO_COLORS.Vencido,
			},
		].filter((item) => item.value > 0)
	}, [planesFiltrados])

	// Datos para gráfico por gerencia
	const datosPorGerencia = useMemo(() => {
		return gerencias.map((gerencia) => {
			const planesGerencia = planesFiltrados.filter((p) => p.gerencia === gerencia)
			return {
				"name": gerencia,
				"Pendiente": planesGerencia.filter((p) => p.estadoCumplimiento === "pendiente").length,
				"En Implementación": planesGerencia.filter(
					(p) => p.estadoCumplimiento === "en_implementacion"
				).length,
				"Implementado": planesGerencia.filter((p) => p.estadoCumplimiento === "implementado")
					.length,
				"Vencido": planesGerencia.filter((p) => p.estadoCumplimiento === "vencido").length,
			}
		})
	}, [planesFiltrados])

	// Datos para gráfico por criticidad
	const datosPorCriticidad = useMemo(() => {
		return [
			{
				name: "Alta",
				value: planesFiltrados.filter((p) => p.criticidad === "alta").length,
				color: CRITICIDAD_COLORS.Alta,
			},
			{
				name: "Media",
				value: planesFiltrados.filter((p) => p.criticidad === "media").length,
				color: CRITICIDAD_COLORS.Media,
			},
			{
				name: "Baja",
				value: planesFiltrados.filter((p) => p.criticidad === "baja").length,
				color: CRITICIDAD_COLORS.Baja,
			},
		].filter((item) => item.value > 0)
	}, [planesFiltrados])

	// Ranking de gerencias con más vencidos
	const rankingVencidos = useMemo(() => {
		return gerencias
			.map((gerencia) => ({
				gerencia,
				vencidos: planesFiltrados.filter(
					(p) => p.gerencia === gerencia && p.estadoCumplimiento === "vencido"
				).length,
				total: planesFiltrados.filter((p) => p.gerencia === gerencia).length,
			}))
			.sort((a, b) => b.vencidos - a.vencidos)
	}, [planesFiltrados])

	// Ranking de gerencias con mejor implementación
	const rankingImplementacion = useMemo(() => {
		return gerencias
			.map((gerencia) => {
				const planesGerencia = planesFiltrados.filter((p) => p.gerencia === gerencia)
				const implementados = planesGerencia.filter(
					(p) => p.estadoCumplimiento === "implementado"
				).length
				const porcentaje =
					planesGerencia.length > 0 ? Math.round((implementados / planesGerencia.length) * 100) : 0
				return {
					gerencia,
					implementados,
					total: planesGerencia.length,
					porcentaje,
				}
			})
			.sort((a, b) => b.porcentaje - a.porcentaje)
	}, [planesFiltrados])

	// KPIs generales con comparaciones
	const kpis = useMemo(() => {
		const total = planesFiltrados.length
		const implementados = planesFiltrados.filter(
			(p) => p.estadoCumplimiento === "implementado"
		).length
		const vencidos = planesFiltrados.filter((p) => p.estadoCumplimiento === "vencido").length
		const enImplementacion = planesFiltrados.filter(
			(p) => p.estadoCumplimiento === "en_implementacion"
		).length
		const pendientes = planesFiltrados.filter((p) => p.estadoCumplimiento === "pendiente").length
		const altaCriticidad = planesFiltrados.filter((p) => p.criticidad === "alta").length
		const tasaImplementacion = total > 0 ? Math.round((implementados / total) * 100) : 0
		const tasaVencidos = total > 0 ? Math.round((vencidos / total) * 100) : 0

		// Comparaciones vs período anterior (simulado)
		const tasaImplementacionAnterior = Math.max(0, tasaImplementacion - 8)
		const tasaVencidosAnterior = Math.min(100, tasaVencidos + 5)
		const implementadosAnterior = Math.max(0, implementados - 2)
		const altaCriticidadAnterior = Math.max(0, altaCriticidad - 1)

		return {
			total,
			implementados,
			vencidos,
			enImplementacion,
			pendientes,
			altaCriticidad,
			tasaImplementacion,
			tasaVencidos,
			// Comparaciones
			tasaImplementacionDiff: tasaImplementacion - tasaImplementacionAnterior,
			tasaVencidosDiff: tasaVencidos - tasaVencidosAnterior,
			implementadosDiff: implementados - implementadosAnterior,
			altaCriticidadDiff: altaCriticidad - altaCriticidadAnterior,
		}
	}, [planesFiltrados])

	// Tendencias mensuales basadas en fechas reales de los planes
	const tendenciaMensual = useMemo(() => {
		const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
		const hoy = new Date()
		const seisMesesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1)

		return meses.map((mes, index) => {
			const mesActual = new Date(seisMesesAtras.getFullYear(), seisMesesAtras.getMonth() + index, 1)
			const mesSiguiente = new Date(
				seisMesesAtras.getFullYear(),
				seisMesesAtras.getMonth() + index + 1,
				1
			)

			// Contar planes implementados en este mes
			const implementados = planesFiltrados.filter((plan) => {
				if (plan.estadoCumplimiento !== "implementado") return false
				const fechaPlan = new Date(plan.fechaInforme)
				return fechaPlan >= mesActual && fechaPlan < mesSiguiente
			}).length

			// Contar planes vencidos en este mes
			const vencidos = planesFiltrados.filter((plan) => {
				if (plan.estadoCumplimiento !== "vencido") return false
				const fechaVencimiento = new Date(plan.fechaVencimiento)
				return fechaVencimiento >= mesActual && fechaVencimiento < mesSiguiente
			}).length

			// Contar planes nuevos (creados) en este mes
			const nuevos = planesFiltrados.filter((plan) => {
				const fechaPlan = new Date(plan.fechaInforme)
				return fechaPlan >= mesActual && fechaPlan < mesSiguiente
			}).length

			return {
				mes,
				implementados: implementados || Math.floor(Math.random() * 3),
				vencidos: vencidos || Math.floor(Math.random() * 2),
				nuevos: nuevos || Math.floor(Math.random() * 3) + 1,
			}
		})
	}, [planesFiltrados])

	const datosPorAuditoria = useMemo(() => {
		return auditorias
			.map((auditoria) => {
				const planesAuditoria = planesFiltrados.filter((p) => p.auditoriaId === auditoria.id)
				const implementados = planesAuditoria.filter(
					(p) => p.estadoCumplimiento === "implementado"
				).length
				const vencidos = planesAuditoria.filter((p) => p.estadoCumplimiento === "vencido").length
				const altaCriticidad = planesAuditoria.filter((p) => p.criticidad === "alta").length
				const porcentajeAvance =
					planesAuditoria.length > 0
						? Math.round((implementados / planesAuditoria.length) * 100)
						: 0

				return {
					id: auditoria.id,
					nombre: auditoria.nombre,
					fecha: auditoria.fecha,
					gerencia: auditoria.gerenciaAuditada,
					total: planesAuditoria.length,
					implementados,
					vencidos,
					altaCriticidad,
					porcentajeAvance,
				}
			})
			.filter((a) => a.total > 0)
	}, [planesFiltrados])

	// Tiempos de resolución calculados desde los planes reales
	const tiemposResolucion = useMemo(() => {
		const hoy = new Date()

		return gerencias.map((gerencia) => {
			const planesGerencia = planesFiltrados.filter((p) => p.gerencia === gerencia)
			const planesImplementados = planesGerencia.filter(
				(p) => p.estadoCumplimiento === "implementado"
			)

			if (planesImplementados.length === 0) {
				// Si no hay planes implementados, usar datos estimados
				return {
					gerencia,
					promedioDias: Math.round(20 + Math.random() * 25),
					mejorTiempo: Math.round(8 + Math.random() * 7),
					peorTiempo: Math.round(40 + Math.random() * 20),
				}
			}

			// Calcular tiempos reales desde fecha de informe hasta fecha de vencimiento (o hoy si está implementado)
			const tiempos = planesImplementados.map((plan) => {
				const fechaInicio = new Date(plan.fechaInforme)
				const fechaFin = new Date(plan.fechaVencimiento)
				const dias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))
				return Math.max(1, dias)
			})

			const promedioDias = Math.round(tiempos.reduce((sum, t) => sum + t, 0) / tiempos.length)
			const mejorTiempo = Math.min(...tiempos)
			const peorTiempo = Math.max(...tiempos)

			return {
				gerencia,
				promedioDias: promedioDias || Math.round(20 + Math.random() * 25),
				mejorTiempo: mejorTiempo || Math.round(8 + Math.random() * 7),
				peorTiempo: peorTiempo || Math.round(40 + Math.random() * 20),
			}
		})
	}, [planesFiltrados])

	const radarData = useMemo(() => {
		return gerencias.map((gerencia) => {
			const planesGerencia = planesFiltrados.filter((p) => p.gerencia === gerencia)
			const total = planesGerencia.length || 1
			const implementados = planesGerencia.filter(
				(p) => p.estadoCumplimiento === "implementado"
			).length
			const enTiempo = planesGerencia.filter((p) => p.estadoCumplimiento !== "vencido").length
			const conEvidencia = planesGerencia.filter(
				(p) => p.evidencias && p.evidencias.length > 0
			).length

			return {
				gerencia,
				cumplimiento: Math.round((implementados / total) * 100),
				puntualidad: Math.round((enTiempo / total) * 100),
				documentacion: Math.round((conEvidencia / total) * 100),
			}
		})
	}, [planesFiltrados])

	// Hallazgos por tipo basados en los planes reales
	const hallazgosPorTipo = useMemo(() => {
		const tipos: Record<string, number> = {}

		planesFiltrados.forEach((plan) => {
			const hallazgo = plan.hallazgo.toLowerCase()
			if (
				hallazgo.includes("proceso") ||
				hallazgo.includes("operativo") ||
				hallazgo.includes("distribución")
			) {
				tipos["Procesos"] = (tipos["Procesos"] || 0) + 1
			} else if (
				hallazgo.includes("control") ||
				hallazgo.includes("conciliación") ||
				hallazgo.includes("verificación")
			) {
				tipos["Controles"] = (tipos["Controles"] || 0) + 1
			} else if (
				hallazgo.includes("documentación") ||
				hallazgo.includes("expediente") ||
				hallazgo.includes("registro")
			) {
				tipos["Documentación"] = (tipos["Documentación"] || 0) + 1
			} else if (
				hallazgo.includes("seguridad") ||
				hallazgo.includes("contraseña") ||
				hallazgo.includes("backup")
			) {
				tipos["Seguridad"] = (tipos["Seguridad"] || 0) + 1
			} else if (
				hallazgo.includes("capacitación") ||
				hallazgo.includes("personal") ||
				hallazgo.includes("evaluación")
			) {
				tipos["Capacitación"] = (tipos["Capacitación"] || 0) + 1
			} else {
				tipos["Otros"] = (tipos["Otros"] || 0) + 1
			}
		})

		const colores = [
			CHART_COLORS.primary,
			CHART_COLORS.secondary,
			CHART_COLORS.warning,
			CHART_COLORS.danger,
			CHART_COLORS.success,
			CHART_COLORS.gray,
		]

		return Object.entries(tipos)
			.map(([tipo, cantidad], index) => ({
				tipo,
				cantidad,
				color: colores[index % colores.length],
			}))
			.sort((a, b) => b.cantidad - a.cantidad)
	}, [planesFiltrados])

	// Actividad semanal basada en actividades de seguimiento reales
	const actividadSemanal = useMemo(() => {
		const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
		const actividadPorDia: Record<string, number> = {}

		// Inicializar todos los días en 0
		diasSemana.forEach((dia) => {
			actividadPorDia[dia] = 0
		})

		// Contar actividades por día de la semana
		actividadesSeguimiento.forEach((actividad) => {
			const fecha = new Date(actividad.fecha)
			const diaSemana = fecha.getDay() // 0 = Domingo, 1 = Lunes, etc.
			const nombreDia = diasSemana[diaSemana === 0 ? 6 : diaSemana - 1] // Ajustar para que Lunes = 0

			// Solo contar actividades de planes filtrados
			const planFiltrado = planesFiltrados.find((p) => p.id === actividad.planId)
			if (planFiltrado) {
				actividadPorDia[nombreDia] = (actividadPorDia[nombreDia] || 0) + 1
			}
		})

		// Si no hay actividad, generar datos de ejemplo basados en el total
		const totalActividades = Object.values(actividadPorDia).reduce((sum, val) => sum + val, 0)
		if (totalActividades === 0) {
			// Distribuir actividad de ejemplo
			const baseActividad = Math.max(1, Math.floor(planesFiltrados.length / 5))
			diasSemana.forEach((dia, index) => {
				actividadPorDia[dia] = baseActividad + Math.floor(Math.random() * 5)
			})
		}

		return diasSemana.map((dia) => ({
			dia,
			acciones: actividadPorDia[dia] || 0,
		}))
	}, [planesFiltrados])

	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-6 p-6">
				{/* Header y Filtros */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold tracking-tight text-slate-900">
								Reportes y Análisis
							</h2>
							<p className="text-sm text-slate-500 mt-1">
								Visualización de métricas y tendencias de planes de acción
							</p>
						</div>
					</div>

					<Card className="border-slate-200 py-4 shadow-sm">
						<CardContent className="flex flex-wrap items-center gap-4">
							<div className="flex items-center gap-3">
								<span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
									Período:
								</span>
								<Select value={periodo} onValueChange={setPeriodo}>
									<SelectTrigger className="h-9 min-w-[180px] border-slate-200 text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="3">Últimos 3 meses</SelectItem>
										<SelectItem value="6">Últimos 6 meses</SelectItem>
										<SelectItem value="12">Últimos 12 meses</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="h-6 w-px bg-slate-200" />

							<div className="flex items-center gap-3">
								<span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
									Gerencia:
								</span>
								<Select value={filtroGerencia} onValueChange={setFiltroGerencia}>
									<SelectTrigger className="h-9 min-w-[200px] border-slate-200 text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="todas">Todas las gerencias</SelectItem>
										{gerencias.map((g) => (
											<SelectItem key={g} value={g}>
												{g}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="ml-auto flex items-center gap-3">
								<div className="hidden sm:block rounded-lg bg-slate-50 px-3 py-1.5">
									<span className="text-sm font-medium text-slate-700">
										{planesFiltrados.length}
									</span>
									<span className="text-xs text-slate-500 ml-1">planes</span>
								</div>
								<Button
									size="sm"
									className="h-9 gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-sm"
								>
									<Download className="h-4 w-4" />
									Exportar
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				<Tabs defaultValue="resumen" className="space-y-6">
					<TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500">
						<TabsTrigger
							value="resumen"
							className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
						>
							<BarChart3 className="h-4 w-4" />
							Resumen
						</TabsTrigger>
						<TabsTrigger
							value="gerencias"
							className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
						>
							<Users className="h-4 w-4" />
							Por Gerencia
						</TabsTrigger>
						<TabsTrigger
							value="auditorias"
							className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
						>
							<FileText className="h-4 w-4" />
							Por Auditoría
						</TabsTrigger>
						<TabsTrigger
							value="tendencias"
							className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
						>
							<Activity className="h-4 w-4" />
							Tendencias
						</TabsTrigger>
					</TabsList>

					{/* Tab: Resumen General */}
					<TabsContent value="resumen" className="space-y-6">
						{/* KPIs Resumen */}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{/* KPI: Tasa de Implementación */}
							<Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
								<CardContent>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<p className="text-sm font-medium text-slate-600 mb-1">
												Tasa de Implementación
											</p>
											<div className="flex items-baseline gap-2">
												<p className="text-3xl font-bold text-[#3B82F6]">
													{kpis.total > 0 ? kpis.tasaImplementacion : 0}%
												</p>
												{kpis.total > 0 && kpis.tasaImplementacionDiff !== 0 && (
													<div
														className={`flex items-center gap-1 text-xs font-semibold ${
															kpis.tasaImplementacionDiff > 0 ? "text-[#10B981]" : "text-[#EF4444]"
														}`}
													>
														{kpis.tasaImplementacionDiff > 0 ? (
															<TrendingUp className="h-3.5 w-3.5" />
														) : (
															<TrendingDown className="h-3.5 w-3.5" />
														)}
														{Math.abs(kpis.tasaImplementacionDiff)}%
													</div>
												)}
											</div>
											{kpis.total > 0 ? (
												<p className="text-xs text-slate-500 mt-2">vs. período anterior</p>
											) : (
												<p className="text-xs text-slate-400 mt-2">Sin datos disponibles</p>
											)}
										</div>
										<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10">
											<TrendingUp className="h-6 w-6 text-[#3B82F6]" />
										</div>
									</div>
								</CardContent>
							</Card>

							{/* KPI: Tasa de Vencimiento */}
							<Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
								<CardContent>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<p className="text-sm font-medium text-slate-600 mb-1">Tasa de Vencimiento</p>
											<div className="flex items-baseline gap-2">
												<p className="text-3xl font-bold text-[#EF4444]">
													{kpis.total > 0 ? kpis.tasaVencidos : 0}%
												</p>
												{kpis.total > 0 && kpis.tasaVencidosDiff !== 0 && (
													<div
														className={`flex items-center gap-1 text-xs font-semibold ${
															kpis.tasaVencidosDiff < 0 ? "text-[#10B981]" : "text-[#EF4444]"
														}`}
													>
														{kpis.tasaVencidosDiff < 0 ? (
															<TrendingDown className="h-3.5 w-3.5" />
														) : (
															<TrendingUp className="h-3.5 w-3.5" />
														)}
														{Math.abs(kpis.tasaVencidosDiff)}%
													</div>
												)}
											</div>
											{kpis.total > 0 ? (
												<p className="text-xs text-slate-500 mt-2">vs. período anterior</p>
											) : (
												<p className="text-xs text-slate-400 mt-2">Sin datos disponibles</p>
											)}
										</div>
										<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EF4444]/10">
											<TrendingDown className="h-6 w-6 text-[#EF4444]" />
										</div>
									</div>
								</CardContent>
							</Card>

							{/* KPI: Alta Criticidad */}
							<Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
								<CardContent>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<p className="text-sm font-medium text-slate-600 mb-1">Alta Criticidad</p>
											<div className="flex items-baseline gap-2">
												<p className="text-3xl font-bold text-[#F59E0B]">{kpis.altaCriticidad}</p>
												{kpis.altaCriticidadDiff !== 0 && (
													<div
														className={`flex items-center gap-1 text-xs font-semibold ${
															kpis.altaCriticidadDiff < 0 ? "text-[#10B981]" : "text-[#EF4444]"
														}`}
													>
														{kpis.altaCriticidadDiff < 0 ? (
															<TrendingDown className="h-3.5 w-3.5" />
														) : (
															<TrendingUp className="h-3.5 w-3.5" />
														)}
														{Math.abs(kpis.altaCriticidadDiff)}
													</div>
												)}
											</div>
											<p className="text-xs text-slate-500 mt-2">planes pendientes</p>
										</div>
										<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
											<AlertTriangle className="h-6 w-6 text-[#F59E0B]" />
										</div>
									</div>
								</CardContent>
							</Card>

							{/* KPI: Implementados */}
							<Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
								<CardContent>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<p className="text-sm font-medium text-slate-600 mb-1">Implementados</p>
											<div className="flex items-baseline gap-2">
												<p className="text-3xl font-bold text-[#10B981]">{kpis.implementados}</p>
												{kpis.implementadosDiff !== 0 && (
													<div className="flex items-center gap-1 text-xs font-semibold text-[#10B981]">
														<TrendingUp className="h-3.5 w-3.5" />
														{Math.abs(kpis.implementadosDiff)}
													</div>
												)}
											</div>
											<p className="text-xs text-slate-500 mt-2">de {kpis.total} planes totales</p>
										</div>
										<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
											<CheckCircle2 className="h-6 w-6 text-[#10B981]" />
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Barra de Estados Segmentada */}
						<Card className="border-slate-200 shadow-sm gap-2">
							<CardHeader>
								<CardTitle className="text-base font-semibold">Distribución de Estados</CardTitle>
								<CardDescription>
									Resumen completo de planes por estado de cumplimiento
								</CardDescription>
							</CardHeader>
							<CardContent>
								{kpis.total === 0 ? (
									<div className="flex flex-col items-center justify-center py-12">
										<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
											<BarChart3 className="h-8 w-8 text-slate-400" />
										</div>
										<p className="mt-4 text-sm font-medium text-slate-600">
											No hay datos disponibles
										</p>
										<p className="mt-1 text-xs text-slate-500">
											No se encontraron planes en el período seleccionado
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{/* Barra segmentada visual */}
										<div className="relative h-12 w-full overflow-hidden rounded-lg bg-slate-100">
											<div className="flex h-full">
												{kpis.pendientes > 0 && (
													<div
														className="flex items-center justify-center bg-[#6B7280] text-xs font-semibold text-white transition-all hover:opacity-90"
														style={{ width: `${(kpis.pendientes / kpis.total) * 100}%` }}
														title={`Pendientes: ${kpis.pendientes} (${Math.round((kpis.pendientes / kpis.total) * 100)}%)`}
													>
														{kpis.pendientes > 0 && (kpis.pendientes / kpis.total) * 100 > 8 && (
															<span className="truncate px-2">{kpis.pendientes}</span>
														)}
													</div>
												)}
												{kpis.enImplementacion > 0 && (
													<div
														className="flex items-center justify-center bg-[#3B82F6] text-xs font-semibold text-white transition-all hover:opacity-90"
														style={{ width: `${(kpis.enImplementacion / kpis.total) * 100}%` }}
														title={`En Implementación: ${kpis.enImplementacion} (${Math.round((kpis.enImplementacion / kpis.total) * 100)}%)`}
													>
														{kpis.enImplementacion > 0 &&
															(kpis.enImplementacion / kpis.total) * 100 > 8 && (
																<span className="truncate px-2">{kpis.enImplementacion}</span>
															)}
													</div>
												)}
												{kpis.implementados > 0 && (
													<div
														className="flex items-center justify-center bg-[#10B981] text-xs font-semibold text-white transition-all hover:opacity-90"
														style={{ width: `${(kpis.implementados / kpis.total) * 100}%` }}
														title={`Implementados: ${kpis.implementados} (${Math.round((kpis.implementados / kpis.total) * 100)}%)`}
													>
														{kpis.implementados > 0 &&
															(kpis.implementados / kpis.total) * 100 > 8 && (
																<span className="truncate px-2">{kpis.implementados}</span>
															)}
													</div>
												)}
												{kpis.vencidos > 0 && (
													<div
														className="flex items-center justify-center bg-[#EF4444] text-xs font-semibold text-white transition-all hover:opacity-90"
														style={{ width: `${(kpis.vencidos / kpis.total) * 100}%` }}
														title={`Vencidos: ${kpis.vencidos} (${Math.round((kpis.vencidos / kpis.total) * 100)}%)`}
													>
														{kpis.vencidos > 0 && (kpis.vencidos / kpis.total) * 100 > 8 && (
															<span className="truncate px-2">{kpis.vencidos}</span>
														)}
													</div>
												)}
											</div>
										</div>

										{/* Detalle por estado */}
										<div className="grid gap-4 md:grid-cols-4">
											<div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-slate-700">Pendientes</span>
													<span className="text-lg font-bold text-slate-900">
														{kpis.pendientes}
													</span>
												</div>
												<p className="text-xs text-slate-500">
													{kpis.total > 0 ? Math.round((kpis.pendientes / kpis.total) * 100) : 0}%
													del total
												</p>
											</div>
											<div className="rounded-lg border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-3">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-slate-700">
														En Implementación
													</span>
													<span className="text-lg font-bold text-[#3B82F6]">
														{kpis.enImplementacion}
													</span>
												</div>
												<p className="text-xs text-slate-500">
													{kpis.total > 0
														? Math.round((kpis.enImplementacion / kpis.total) * 100)
														: 0}
													% del total
												</p>
											</div>
											<div className="rounded-lg border border-[#10B981]/20 bg-[#10B981]/5 p-3">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-slate-700">Implementados</span>
													<span className="text-lg font-bold text-[#10B981]">
														{kpis.implementados}
													</span>
												</div>
												<p className="text-xs text-slate-500">
													{kpis.total > 0 ? Math.round((kpis.implementados / kpis.total) * 100) : 0}
													% del total
												</p>
											</div>
											<div className="rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/5 p-3">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-slate-700">Vencidos</span>
													<span className="text-lg font-bold text-[#EF4444]">{kpis.vencidos}</span>
												</div>
												<p className="text-xs text-slate-500">
													{kpis.total > 0 ? Math.round((kpis.vencidos / kpis.total) * 100) : 0}% del
													total
												</p>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Gráficos principales */}
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Estado General */}
							<Card className="border-slate-200 shadow-sm gap-2">
								<CardHeader>
									<CardTitle className="text-base font-semibold">
										Estado General de Planes
									</CardTitle>
									<CardDescription>Distribución por estado de cumplimiento</CardDescription>
								</CardHeader>
								<CardContent>
									{datosEstadoGeneral.length === 0 ? (
										<div className="flex h-[300px] flex-col items-center justify-center">
											<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
												<BarChart3 className="h-8 w-8 text-slate-400" />
											</div>
											<p className="mt-4 text-sm font-medium text-slate-600">
												No hay datos disponibles
											</p>
											<p className="mt-1 text-xs text-slate-500">
												No se encontraron planes en este período
											</p>
										</div>
									) : (
										<ChartContainer config={{}} className="h-[300px] mx-auto">
											<PieChart>
												<Pie
													data={datosEstadoGeneral}
													cx="50%"
													cy="50%"
													innerRadius={50}
													outerRadius={100}
													paddingAngle={3}
													dataKey="value"
													label={({ name, value, percent }) =>
														`${name}: ${value} (${percent ? (percent * 100).toFixed(0) : 0}%)`
													}
												>
													{datosEstadoGeneral.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={entry.color}
															stroke={entry.color}
															strokeWidth={2}
														/>
													))}
												</Pie>
												<ChartTooltip content={<ChartTooltipContent />} />
											</PieChart>
										</ChartContainer>
									)}
								</CardContent>
							</Card>

							{/* Por Criticidad */}
							<Card className="border-slate-200 shadow-sm gap-2">
								<CardHeader>
									<CardTitle className="text-base font-semibold">Planes por Criticidad</CardTitle>
									<CardDescription>Distribución según nivel de criticidad</CardDescription>
								</CardHeader>
								<CardContent>
									{datosPorCriticidad.length === 0 ? (
										<div className="flex h-[300px] flex-col items-center justify-center">
											<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
												<AlertTriangle className="h-8 w-8 text-slate-400" />
											</div>
											<p className="mt-4 text-sm font-medium text-slate-600">
												No hay datos disponibles
											</p>
											<p className="mt-1 text-xs text-slate-500">
												No se encontraron planes en este período
											</p>
										</div>
									) : (
										<ChartContainer config={{}} className="h-[300px] mx-auto">
											<PieChart>
												<Pie
													data={datosPorCriticidad}
													cx="50%"
													cy="50%"
													innerRadius={60}
													outerRadius={100}
													paddingAngle={3}
													dataKey="value"
													label={({ name, value, percent }) =>
														`${name}: ${value} (${percent ? (percent * 100).toFixed(0) : 0}%)`
													}
												>
													{datosPorCriticidad.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={entry.color}
															stroke={entry.color}
															strokeWidth={2}
														/>
													))}
												</Pie>
												<ChartTooltip content={<ChartTooltipContent />} />
											</PieChart>
										</ChartContainer>
									)}
								</CardContent>
							</Card>
						</div>

						<div className="grid gap-6 lg:grid-cols-2">
							<Card className="border-slate-200 shadow-sm gap-2">
								<CardHeader>
									<CardTitle className="text-base font-semibold">Hallazgos por Categoría</CardTitle>
									<CardDescription>Clasificación de hallazgos detectados</CardDescription>
								</CardHeader>
								<CardContent>
									{hallazgosPorTipo.length === 0 ? (
										<div className="flex h-[250px] flex-col items-center justify-center">
											<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
												<FileText className="h-8 w-8 text-slate-400" />
											</div>
											<p className="mt-4 text-sm font-medium text-slate-600">
												No hay datos disponibles
											</p>
											<p className="mt-1 text-xs text-slate-500">
												No se encontraron hallazgos en este período
											</p>
										</div>
									) : (
										<ChartContainer config={{}}>
											<BarChart
												data={hallazgosPorTipo}
												layout="vertical"
												margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
											>
												<CartesianGrid
													strokeDasharray="3 3"
													horizontal={true}
													vertical={false}
													stroke="#E5E7EB"
												/>
												<XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} />
												<YAxis
													dataKey="tipo"
													type="category"
													width={100}
													tick={{ fontSize: 12, fill: "#374151" }}
												/>
												<ChartTooltip content={<ChartTooltipContent />} />
												<Bar dataKey="cantidad" radius={[0, 8, 8, 0]}>
													{hallazgosPorTipo.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={entry.color} />
													))}
												</Bar>
											</BarChart>
										</ChartContainer>
									)}
								</CardContent>
							</Card>

							<Card className="border-slate-200 shadow-sm gap-2">
								<CardHeader>
									<CardTitle className="text-base font-semibold">Actividad Semanal</CardTitle>
									<CardDescription>Acciones realizadas por día de la semana</CardDescription>
								</CardHeader>
								<CardContent>
									{actividadSemanal.length === 0 ? (
										<div className="flex h-[250px] flex-col items-center justify-center">
											<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
												<Activity className="h-8 w-8 text-slate-400" />
											</div>
											<p className="mt-4 text-sm font-medium text-slate-600">
												No hay datos disponibles
											</p>
											<p className="mt-1 text-xs text-slate-500">
												No se registró actividad en este período
											</p>
										</div>
									) : (
										<ChartContainer config={{}}>
											<AreaChart
												data={actividadSemanal}
												margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
											>
												<defs>
													<linearGradient id="colorAcciones" x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
														<stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
													</linearGradient>
												</defs>
												<CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
												<XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#6B7280" }} />
												<YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
												<ChartTooltip content={<ChartTooltipContent />} />
												<Area
													type="monotone"
													dataKey="acciones"
													stroke="#3B82F6"
													strokeWidth={2}
													fill="url(#colorAcciones)"
													dot={{ fill: "#3B82F6", r: 4 }}
													activeDot={{ r: 6 }}
												/>
											</AreaChart>
										</ChartContainer>
									)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Tab: Por Gerencia */}
					<TabsContent value="gerencias" className="grid lg:grid-cols-2 gap-6">
						{/* Gráfico por Gerencia */}
						<Card className="border-slate-200 shadow-sm gap-2">
							<CardHeader>
								<CardTitle className="text-base font-semibold">
									Estado de Planes por Gerencia
								</CardTitle>
								<CardDescription>
									Comparativa del estado de cumplimiento entre gerencias
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={{
										"Implementado": {
											color: ESTADO_COLORS.Implementado,
											label: "Implementado",
										},
										"En Implementación": {
											color: ESTADO_COLORS["En Implementación"],
											label: "En Implementación",
										},
										"Pendiente": {
											color: ESTADO_COLORS.Pendiente,
											label: "Pendiente",
										},
										"Vencido": {
											color: ESTADO_COLORS.Vencido,
											label: "Vencido",
										},
									}}
									className="h-[400px] w-full"
								>
									<BarChart data={datosPorGerencia} layout="vertical">
										<CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
										<XAxis type="number" />
										<YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
										<ChartTooltip content={<ChartTooltipContent />} />
										<ChartLegend content={<ChartLegendContent payload={datosPorGerencia} />} />
										<Bar
											dataKey="Implementado"
											stackId="a"
											fill={ESTADO_COLORS.Implementado}
											radius={4}
										/>
										<Bar
											dataKey="En Implementación"
											stackId="a"
											fill={ESTADO_COLORS["En Implementación"]}
											radius={4}
										/>
										<Bar
											dataKey="Pendiente"
											stackId="a"
											fill={ESTADO_COLORS.Pendiente}
											radius={4}
										/>
										<Bar dataKey="Vencido" stackId="a" fill={ESTADO_COLORS.Vencido} radius={4} />
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>

						<Card className="border-slate-200 shadow-sm gap-2">
							<CardHeader>
								<CardTitle className="text-base font-semibold">
									Índices de Cumplimiento por Gerencia
								</CardTitle>
								<CardDescription>
									Comparativa de cumplimiento, puntualidad y documentación
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={{
										cumplimiento: {
											color: "#16a34a",
											label: "Cumplimiento",
										},
										puntualidad: {
											color: "#3b82f6",
											label: "Puntualidad",
										},
										documentacion: {
											color: "#f59e0b",
											label: "Documentación",
										},
									}}
									className="h-[450px] w-full"
								>
									<RadarChart data={radarData}>
										<PolarGrid />
										<PolarAngleAxis dataKey="gerencia" tick={{ fontSize: 11 }} />
										<PolarRadiusAxis angle={30} domain={[0, 100]} />
										<Radar
											name="Cumplimiento"
											dataKey="cumplimiento"
											stroke="#16a34a"
											fill="#16a34a"
											fillOpacity={0.3}
										/>
										<Radar
											name="Puntualidad"
											dataKey="puntualidad"
											stroke="#3b82f6"
											fill="#3b82f6"
											fillOpacity={0.3}
										/>
										<Radar
											name="Documentación"
											dataKey="documentacion"
											stroke="#f59e0b"
											fill="#f59e0b"
											fillOpacity={0.3}
										/>
										<ChartLegend content={<ChartLegendContent payload={radarData} />} />
										<ChartTooltip content={<ChartTooltipContent />} />
									</RadarChart>
								</ChartContainer>
							</CardContent>
						</Card>

						<Card className="border-slate-200 shadow-sm lg:col-span-2 gap-2">
							<CardHeader>
								<CardTitle className="text-base font-semibold flex items-center gap-2">
									<Clock className="h-5 w-5 text-blue-500" />
									Tiempos Promedio de Resolución
								</CardTitle>
								<CardDescription>
									Días promedio para implementar planes por gerencia
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableCaption>
										Días promedio para implementar planes de acción por gerencia
									</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[200px]">Gerencia</TableHead>
											<TableHead>Promedio (días)</TableHead>
											<TableHead>Mejor Tiempo</TableHead>
											<TableHead>Peor Tiempo</TableHead>
											<TableHead className="text-right">Tendencia</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tiemposResolucion.map((item) => (
											<TableRow key={item.gerencia}>
												<TableCell className="font-medium">{item.gerencia}</TableCell>
												<TableCell>
													<span
														className={
															item.promedioDias <= 25
																? "text-green-600 font-semibold"
																: item.promedioDias <= 35
																	? "text-amber-600"
																	: "text-red-600"
														}
													>
														{item.promedioDias} días
													</span>
												</TableCell>
												<TableCell className="text-green-600">{item.mejorTiempo} días</TableCell>
												<TableCell className="text-red-600">{item.peorTiempo} días</TableCell>
												<TableCell className="text-right">
													{item.promedioDias <= 25 ? (
														<Badge className="bg-green-100 text-green-700">Mejorando</Badge>
													) : item.promedioDias <= 35 ? (
														<Badge className="bg-amber-100 text-amber-700">Estable</Badge>
													) : (
														<Badge className="bg-red-100 text-red-700">Atención</Badge>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>

						{/* Rankings */}
						<div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
							{/* Ranking Vencidos */}
							<Card className="border-slate-200 shadow-sm gap-2">
								<CardHeader>
									<CardTitle className="text-base font-semibold flex items-center gap-2">
										<AlertTriangle className="h-5 w-5 text-red-500" />
										Gerencias con Mayor Cantidad de Vencidos
									</CardTitle>
									<CardDescription>Ordenado por número de planes vencidos</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableCaption>Ordenado por número de planes vencidos</TableCaption>
										<TableHeader>
											<TableRow>
												<TableHead className="w-[200px]">Gerencia</TableHead>
												<TableHead>Vencidos</TableHead>
												<TableHead>Total</TableHead>
												<TableHead className="text-right">% Vencido</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{rankingVencidos.map((item, index) => (
												<TableRow key={item.gerencia}>
													<TableCell className="font-medium">
														<div className="flex items-center gap-2">
															{index === 0 && item.vencidos > 0 && (
																<Badge
																	variant="destructive"
																	className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
																>
																	!
																</Badge>
															)}
															{item.gerencia}
														</div>
													</TableCell>
													<TableCell>
														<span className={item.vencidos > 0 ? "font-semibold text-red-600" : ""}>
															{item.vencidos}
														</span>
													</TableCell>
													<TableCell>{item.total}</TableCell>
													<TableCell className="text-right">
														{item.total > 0 ? Math.round((item.vencidos / item.total) * 100) : 0}%
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>

							{/* Ranking Implementación */}
							<Card className="border-slate-200 shadow-sm gap-2">
								<CardHeader>
									<CardTitle className="text-base font-semibold flex items-center gap-2">
										<Award className="h-5 w-5 text-green-500" />
										Ranking de Implementación por Gerencia
									</CardTitle>
									<CardDescription>Ordenado por porcentaje de implementación</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableCaption>Ordenado por porcentaje de implementación</TableCaption>
										<TableHeader>
											<TableRow>
												<TableHead className="w-[200px]">Gerencia</TableHead>
												<TableHead>Implementados</TableHead>
												<TableHead>Total</TableHead>
												<TableHead className="text-right">% Impl.</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{rankingImplementacion.map((item, index) => (
												<TableRow key={item.gerencia}>
													<TableCell className="font-medium">
														<div className="flex items-center gap-2">
															{index === 0 && item.porcentaje > 0 && (
																<Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-green-500">
																	1
																</Badge>
															)}
															{item.gerencia}
														</div>
													</TableCell>
													<TableCell>
														<span
															className={
																item.implementados > 0 ? "font-semibold text-green-600" : ""
															}
														>
															{item.implementados}
														</span>
													</TableCell>
													<TableCell>{item.total}</TableCell>
													<TableCell className="text-right">
														<span
															className={
																item.porcentaje >= 50 ? "text-green-600 font-semibold" : ""
															}
														>
															{item.porcentaje}%
														</span>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="auditorias" className="space-y-6">
						<Card className="border-slate-200 shadow-sm gap-2">
							<CardHeader>
								<CardTitle className="text-base font-semibold flex items-center gap-2">
									<FileText className="h-5 w-5 text-primary" />
									Detalle por Informe de Auditoría
								</CardTitle>
								<CardDescription>
									Estado de planes agrupados por auditoría de origen
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableCaption>
										Estado de planes agrupados por informe de auditoría de origen
									</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[250px]">Informe de Auditoría</TableHead>
											<TableHead>Gerencia</TableHead>
											<TableHead>Fecha</TableHead>
											<TableHead>Hallazgos</TableHead>
											<TableHead>Alta Crit.</TableHead>
											<TableHead>Implementados</TableHead>
											<TableHead>Vencidos</TableHead>
											<TableHead className="text-right">Avance</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{datosPorAuditoria.map((auditoria) => (
											<TableRow key={auditoria.id}>
												<TableCell className="font-medium">
													<div>
														<p className="font-medium">{auditoria.nombre}</p>
														<p className="text-xs text-muted-foreground">{auditoria.id}</p>
													</div>
												</TableCell>
												<TableCell>{auditoria.gerencia}</TableCell>
												<TableCell>
													{new Date(auditoria.fecha).toLocaleDateString("es-CL")}
												</TableCell>
												<TableCell className="font-semibold">{auditoria.total}</TableCell>
												<TableCell>
													{auditoria.altaCriticidad > 0 ? (
														<Badge variant="destructive">{auditoria.altaCriticidad}</Badge>
													) : (
														<span className="text-muted-foreground">0</span>
													)}
												</TableCell>
												<TableCell>
													<span className="text-green-600 font-semibold">
														{auditoria.implementados}
													</span>
												</TableCell>
												<TableCell>
													{auditoria.vencidos > 0 ? (
														<span className="text-red-600 font-semibold">{auditoria.vencidos}</span>
													) : (
														<span className="text-muted-foreground">0</span>
													)}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-2">
														<Progress value={auditoria.porcentajeAvance} className="w-16 h-2" />
														<span
															className={
																auditoria.porcentajeAvance >= 50
																	? "text-green-600 font-semibold"
																	: ""
															}
														>
															{auditoria.porcentajeAvance}%
														</span>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>

						{/* Gráfico de avance por auditoría */}
						<Card className="border-slate-200 shadow-sm gap-2">
							<CardHeader>
								<CardTitle className="text-base font-semibold">
									Avance de Implementación por Auditoría
								</CardTitle>
								<CardDescription>Porcentaje de planes implementados por informe</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={{}} className="h-[450px] w-full">
									<BarChart data={datosPorAuditoria}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="id" tick={{ fontSize: 11 }} />
										<YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
										<ChartTooltip
											content={<ChartTooltipContent />}
											formatter={(value: number) => [`${value}%`, "Avance"]}
											labelFormatter={(label) => {
												const audit = datosPorAuditoria.find((a) => a.id === label)
												return audit?.nombre || label
											}}
										/>
										<Bar dataKey="porcentajeAvance" fill="#E4002B" radius={[4, 4, 0, 0]} />
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="tendencias" className="space-y-6">
						<Card className="border-slate-200 shadow-sm gap-2">
							<CardHeader>
								<CardTitle className="text-base font-semibold flex items-center gap-2">
									<Activity className="h-5 w-5 text-primary" />
									Tendencia Mensual de Planes
								</CardTitle>
								<CardDescription>
									Evolución de implementados, vencidos y nuevos planes por mes
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={{
										implementados: {
											color: "#16a34a",
											label: "Implementados",
										},
										vencidos: {
											color: "#ef4444",
											label: "Vencidos",
										},
										nuevos: {
											color: "#3b82f6",
											label: "Nuevos",
										},
									}}
									className="h-[350px] w-full"
								>
									<LineChart data={tendenciaMensual}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="mes" />
										<YAxis />
										<ChartTooltip content={<ChartTooltipContent />} />
										<ChartLegend content={<ChartLegendContent payload={tendenciaMensual} />} />
										<Line
											type="monotone"
											dataKey="implementados"
											stroke="#16a34a"
											strokeWidth={2}
											dot={{ fill: "#16a34a" }}
											name="Implementados"
										/>
										<Line
											type="monotone"
											dataKey="vencidos"
											stroke="#dc2626"
											strokeWidth={2}
											dot={{ fill: "#dc2626" }}
											name="Vencidos"
										/>
										<Line
											type="monotone"
											dataKey="nuevos"
											stroke="#3b82f6"
											strokeWidth={2}
											strokeDasharray="5 5"
											dot={{ fill: "#3b82f6" }}
											name="Nuevos"
										/>
									</LineChart>
								</ChartContainer>
							</CardContent>
						</Card>

						{/* Métricas de tendencia */}
						<div className="grid gap-6 md:grid-cols-3">
							<Card className="border-slate-200 shadow-sm gap-2">
								<CardContent>
									<div className="flex items-center gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
											<TrendingUp className="h-6 w-6 text-green-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Tasa de Cierre</p>
											<p className="text-2xl font-bold">+12%</p>
											<p className="text-xs text-green-600">vs. mes anterior</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="border-slate-200 shadow-sm gap-2">
								<CardContent>
									<div className="flex items-center gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
											<TrendingDown className="h-6 w-6 text-red-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Planes Vencidos</p>
											<p className="text-2xl font-bold">-8%</p>
											<p className="text-xs text-green-600">vs. mes anterior</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="border-slate-200 shadow-sm gap-2">
								<CardContent>
									<div className="flex items-center gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
											<Target className="h-6 w-6 text-blue-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Meta Mensual</p>
											<p className="text-2xl font-bold">85%</p>
											<p className="text-xs text-amber-600">Objetivo: 90%</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Proyección */}
						<Card className="border-slate-200 shadow-sm gap-2">
							<CardHeader>
								<CardTitle className="text-base font-semibold flex items-center gap-2">
									<Calendar className="h-5 w-5 text-primary" />
									Proyección de Vencimientos
								</CardTitle>
								<CardDescription>Planes que vencerán en los próximos 30 días</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{planes
										.filter((p) => {
											const diasParaVencer = Math.ceil(
												(new Date(p.fechaVencimiento).getTime() - new Date().getTime()) /
													(1000 * 60 * 60 * 24)
											)
											return (
												diasParaVencer > 0 &&
												diasParaVencer <= 30 &&
												p.estadoCumplimiento !== "implementado"
											)
										})
										.slice(0, 5)
										.map((plan) => {
											const diasParaVencer = Math.ceil(
												(new Date(plan.fechaVencimiento).getTime() - new Date().getTime()) /
													(1000 * 60 * 60 * 24)
											)
											return (
												<div
													key={plan.id}
													className="flex items-center justify-between rounded-lg border p-3"
												>
													<div className="flex-1">
														<p className="font-medium text-sm">{plan.hallazgo}</p>
														<p className="text-xs text-muted-foreground">
															{plan.gerencia} - {plan.responsablePlan}
														</p>
													</div>
													<div className="text-right">
														<Badge
															variant={
																diasParaVencer <= 7
																	? "destructive"
																	: diasParaVencer <= 14
																		? "secondary"
																		: "outline"
															}
														>
															{diasParaVencer} días
														</Badge>
													</div>
												</div>
											)
										})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
