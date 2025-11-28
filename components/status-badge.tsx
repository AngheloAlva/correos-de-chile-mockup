import { Badge } from "@/components/ui/badge"
import type { EstadoCumplimiento } from "@/lib/types"
import { estadosLabels } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  estado: EstadoCumplimiento
  className?: string
}

const statusStyles: Record<EstadoCumplimiento, string> = {
  pendiente: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  en_implementacion: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  implementado: "bg-green-100 text-green-700 hover:bg-green-100",
  vencido: "bg-red-100 text-red-700 hover:bg-red-100",
}

export function StatusBadge({ estado, className }: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(statusStyles[estado], className)}>
      {estadosLabels[estado]}
    </Badge>
  )
}
