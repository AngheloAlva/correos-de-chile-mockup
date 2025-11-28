import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface CardKpiProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "primary" | "warning" | "danger" | "success"
}

const variantStyles = {
  default: "bg-white",
  primary: "bg-primary/5 border-primary/20",
  warning: "bg-amber-50 border-amber-200",
  danger: "bg-red-50 border-red-200",
  success: "bg-green-50 border-green-200",
}

const iconVariantStyles = {
  default: "bg-slate-100 text-slate-600",
  primary: "bg-primary/10 text-primary",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-red-100 text-red-600",
  success: "bg-green-100 text-green-600",
}

export function CardKpi({ title, value, subtitle, icon: Icon, trend, variant = "default" }: CardKpiProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", variantStyles[variant])}>
      <CardContent className="py-2">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{value}</span>
              {trend && (
                <span className={cn("text-sm font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
                  {trend.isPositive ? "+" : "-"}
                  {trend.value}%
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn("rounded-lg p-3", iconVariantStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
