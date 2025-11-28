"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts"
import type { PlanDeAccion } from "@/lib/types"
import { criticidadLabels } from "@/lib/mock-data"
import {
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	ChartLegendContent,
	ChartTooltipContent,
} from "./ui/chart"

interface DashboardChartsProps {
	planes: PlanDeAccion[]
}

const COLORS = {
	alta: "#dc2626",
	media: "#f59e0b",
	baja: "#16a34a",
}

export function CriticidadChart({ planes }: DashboardChartsProps) {
	const data = [
		{
			name: criticidadLabels.alta,
			value: planes.filter((p) => p.criticidad === "alta").length,
			color: COLORS.alta,
		},
		{
			name: criticidadLabels.media,
			value: planes.filter((p) => p.criticidad === "media").length,
			color: COLORS.media,
		},
		{
			name: criticidadLabels.baja,
			value: planes.filter((p) => p.criticidad === "baja").length,
			color: COLORS.baja,
		},
	]

	return (
		<Card className="border-slate-200 shadow-sm">
			<CardHeader>
				<CardTitle className="text-base font-semibold">Planes por Criticidad</CardTitle>
				<CardDescription>Distribución según nivel de criticidad</CardDescription>
			</CardHeader>
			<CardContent className="p-0 px-1">
				<ChartContainer
					config={{
						[criticidadLabels.alta]: {
							color: COLORS.alta,
							label: criticidadLabels.alta,
						},
						[criticidadLabels.media]: {
							color: COLORS.media,
							label: criticidadLabels.media,
						},
						[criticidadLabels.baja]: {
							color: COLORS.baja,
							label: criticidadLabels.baja,
						},
					}}
					className="mx-auto aspect-square max-h-[350px]"
				>
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Pie
							cx="50%"
							cy="50%"
							data={data}
							dataKey="value"
							innerRadius={50}
							outerRadius={90}
							paddingAngle={2}
							label={({ name, value }) => `${name}: ${value}`}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
												>
													{data.reduce((a, b) => a + b.value, 0)}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Planes
												</tspan>
											</text>
										)
									}
								}}
							/>

							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>

						<ChartLegend
							className="flex justify-center flex-wrap"
							content={<ChartLegendContent payload={data} />}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

const ESTADO_COLORS = {
	pendiente: "#94a3b8",
	en_implementacion: "#3b82f6",
	implementado: "#16a34a",
	vencido: "#dc2626",
}

export function EstadosPorGerenciaChart({ planes }: DashboardChartsProps) {
	const gerencias = [...new Set(planes.map((p) => p.gerencia))]

	const data = gerencias.map((gerencia) => {
		const planesGerencia = planes.filter((p) => p.gerencia === gerencia)
		return {
			"name": gerencia,
			"Pendiente": planesGerencia.filter((p) => p.estadoCumplimiento === "pendiente").length,
			"En Implementación": planesGerencia.filter(
				(p) => p.estadoCumplimiento === "en_implementacion"
			).length,
			"Implementado": planesGerencia.filter((p) => p.estadoCumplimiento === "implementado").length,
			"Vencido": planesGerencia.filter((p) => p.estadoCumplimiento === "vencido").length,
		}
	})

	return (
		<Card className="border-slate-200 shadow-sm">
			<CardHeader>
				<CardTitle className="text-base font-semibold">Estado por Gerencia</CardTitle>
				<CardDescription>Distribución de planes por estado y gerencia</CardDescription>
			</CardHeader>

			<CardContent className="p-0 px-1 h-full">
				<ChartContainer
					className="mx-auto "
					config={{
						"Pendiente": {
							color: ESTADO_COLORS.pendiente,
							label: "Pendiente",
						},
						"En Implementación": {
							color: ESTADO_COLORS.en_implementacion,
							label: "En Implementación",
						},
						"Implementado": {
							color: ESTADO_COLORS.implementado,
							label: "Implementado",
						},
						"Vencido": {
							color: ESTADO_COLORS.vencido,
							label: "Vencido",
						},
					}}
				>
					<BarChart data={data} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
						<ChartTooltip content={<ChartTooltipContent />} />

						<XAxis type="number" />
						<YAxis dataKey="name" type="category" width={60} angle={-45} tick={{ fontSize: 12 }} />
						<Bar dataKey="Pendiente" stackId="a" fill={ESTADO_COLORS.pendiente} />
						<Bar dataKey="En Implementación" stackId="a" fill={ESTADO_COLORS.en_implementacion} />
						<Bar dataKey="Implementado" stackId="a" fill={ESTADO_COLORS.implementado} />
						<Bar dataKey="Vencido" stackId="a" fill={ESTADO_COLORS.vencido} radius={[0, 4, 4, 0]} />

						<ChartLegend
							className="flex  justify-center flex-wrap"
							content={<ChartLegendContent payload={data} />}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
