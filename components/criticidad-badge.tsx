import { Badge } from "@/components/ui/badge"
import type { Criticidad } from "@/lib/types"
import { criticidadLabels } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface CriticidadBadgeProps {
  criticidad: Criticidad
  className?: string
}

const criticidadStyles: Record<Criticidad, string> = {
  alta: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
  media: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  baja: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
}

export function CriticidadBadge({ criticidad, className }: CriticidadBadgeProps) {
  return (
    <Badge variant="outline" className={cn(criticidadStyles[criticidad], className)}>
      {criticidadLabels[criticidad]}
    </Badge>
  )
}
