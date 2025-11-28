"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserRole, PlanDeAccion, ActividadSeguimiento, Notificacion } from "./types"
import { planesDeAccion as initialPlanes, actividadesSeguimiento as initialActividades } from "./mock-data"

interface AppContextType {
  rol: UserRole
  setRol: (rol: UserRole) => void
  gerenciaActual: string
  planes: PlanDeAccion[]
  setPlanes: React.Dispatch<React.SetStateAction<PlanDeAccion[]>>
  actividades: ActividadSeguimiento[]
  setActividades: React.Dispatch<React.SetStateAction<ActividadSeguimiento[]>>
  notificaciones: Notificacion[]
  marcarNotificacionLeida: (id: string) => void
  actualizarEstadoPlan: (planId: string, nuevoEstado: PlanDeAccion["estadoCumplimiento"]) => void
  agregarActividad: (actividad: Omit<ActividadSeguimiento, "id">) => void
  agregarEvidencia: (planId: string, evidencia: PlanDeAccion["evidencias"][0]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<UserRole>("auditor")
  const [planes, setPlanes] = useState<PlanDeAccion[]>(initialPlanes)
  const [actividades, setActividades] = useState<ActividadSeguimiento[]>(initialActividades)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])

  const gerenciaActual = rol === "gerencia" ? "Operaciones" : ""

  // Calcular notificaciones basadas en fechas de vencimiento
  useEffect(() => {
    const hoy = new Date()
    const nuevasNotificaciones: Notificacion[] = []

    planes.forEach((plan) => {
      if (plan.estadoCumplimiento === "implementado") return

      const fechaVenc = new Date(plan.fechaVencimiento)
      const diasRestantes = Math.ceil((fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

      if (diasRestantes < 0 && plan.estadoCumplimiento !== "vencido") {
        // Actualizar estado a vencido
        setPlanes((prev) => prev.map((p) => (p.id === plan.id ? { ...p, estadoCumplimiento: "vencido" as const } : p)))
      }

      if (diasRestantes < 0) {
        nuevasNotificaciones.push({
          id: `notif-vencido-${plan.id}`,
          planId: plan.id,
          tipo: "vencido",
          mensaje: `El plan "${plan.hallazgo}" está vencido`,
          fecha: hoy.toISOString(),
          leida: false,
        })
      } else if (diasRestantes <= 7) {
        nuevasNotificaciones.push({
          id: `notif-proximo-${plan.id}`,
          planId: plan.id,
          tipo: "proximo_vencer",
          mensaje: `El plan "${plan.hallazgo}" vence en ${diasRestantes} días`,
          fecha: hoy.toISOString(),
          leida: false,
        })
      }
    })

    setNotificaciones(nuevasNotificaciones)
  }, [planes])

  const marcarNotificacionLeida = (id: string) => {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  }

  const actualizarEstadoPlan = (planId: string, nuevoEstado: PlanDeAccion["estadoCumplimiento"]) => {
    setPlanes((prev) => prev.map((p) => (p.id === planId ? { ...p, estadoCumplimiento: nuevoEstado } : p)))
  }

  const agregarActividad = (actividad: Omit<ActividadSeguimiento, "id">) => {
    const nuevaActividad: ActividadSeguimiento = {
      ...actividad,
      id: `ACT-${Date.now()}`,
    }
    setActividades((prev) => [...prev, nuevaActividad])
  }

  const agregarEvidencia = (planId: string, evidencia: PlanDeAccion["evidencias"][0]) => {
    setPlanes((prev) => prev.map((p) => (p.id === planId ? { ...p, evidencias: [...p.evidencias, evidencia] } : p)))
  }

  return (
    <AppContext.Provider
      value={{
        rol,
        setRol,
        gerenciaActual,
        planes,
        setPlanes,
        actividades,
        setActividades,
        notificaciones,
        marcarNotificacionLeida,
        actualizarEstadoPlan,
        agregarActividad,
        agregarEvidencia,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
