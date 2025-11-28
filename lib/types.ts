export type UserRole = "gerencia" | "auditor" | "comite"

export type EstadoCumplimiento = "pendiente" | "en_implementacion" | "implementado" | "vencido"

export type Criticidad = "alta" | "media" | "baja"

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: UserRole
  gerencia?: string
  avatar?: string
}

export interface Auditoria {
  id: string
  nombre: string
  fecha: string
  gerenciaAuditada: string
  descripcion: string
}

export interface PlanDeAccion {
  id: string
  auditoriaId: string
  nombreInforme: string
  fechaInforme: string
  hallazgo: string
  hallazgoDescripcion: string
  criticidad: Criticidad
  planAccion: string
  responsablePlan: string
  gerencia: string
  fechaVencimiento: string
  estadoCumplimiento: EstadoCumplimiento
  responsableAuditoria: string
  evidencias: Evidencia[]
}

export interface Evidencia {
  id: string
  nombre: string
  tipo: string
  tamaño: string
  fechaCarga: string
  cargadoPor: string
}

export interface ActividadSeguimiento {
  id: string
  planId: string
  fecha: string
  usuario: string
  rol: UserRole
  accion: string
  comentario?: string
}

export interface Notificacion {
  id: string
  planId: string
  tipo: "proximo_vencer" | "vencido"
  mensaje: string
  fecha: string
  leida: boolean
}
