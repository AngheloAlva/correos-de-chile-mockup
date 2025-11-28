"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/lib/context"
import { Settings, Bell, Users, Shield, Database } from "lucide-react"

export default function ConfiguracionPage() {
  const { rol } = useApp()

  // Solo auditor y gerencia pueden ver configuración
  if (rol === "comite") {
    return (
      <div className="flex flex-col">
        <div className="flex flex-1 items-center justify-center p-6">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Acceso Restringido</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No tienes permisos para acceder a esta sección. Contacta al administrador si necesitas acceso.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>Configura las alertas y notificaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de vencimiento</Label>
                  <p className="text-xs text-muted-foreground">Notificar cuando un plan esté por vencer</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Días de anticipación</Label>
                  <p className="text-xs text-muted-foreground">Días antes del vencimiento para alertar</p>
                </div>
                <Input type="number" defaultValue={7} className="w-20" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por email</Label>
                  <p className="text-xs text-muted-foreground">Recibir alertas en el correo corporativo</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Usuarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>Administra los usuarios del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Esta funcionalidad está disponible solo para administradores del sistema.
                </p>
                <Button variant="outline" className="mt-4 bg-transparent" disabled>
                  Gestionar Usuarios
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-5 w-5" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>Parámetros generales del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo oscuro</Label>
                  <p className="text-xs text-muted-foreground">Cambiar a tema oscuro</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Idioma</Label>
                  <p className="text-xs text-muted-foreground">Idioma de la interfaz</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Español (Chile)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Base de datos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-5 w-5" />
                Datos y Respaldos
              </CardTitle>
              <CardDescription>Gestión de datos del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">Último respaldo</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                <Button variant="outline" size="sm" className="mt-3 bg-transparent" disabled>
                  Crear Respaldo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
