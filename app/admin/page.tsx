import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Activity, Database, Shield, Users, Building2, CreditCard } from "lucide-react"
import Link from "next/link"
import { getSystemActivity } from "@/lib/database/audit"
import { getSystemSettings } from "@/lib/database/settings"
import { getDepartments } from "@/lib/database/departments"
import { getEmployees } from "@/lib/database/employees"
import { getTransactionSummary } from "@/lib/database/transactions"

export default async function AdminPage() {
  const [activity, settings, departments, employees, transactionSummary] = await Promise.all([
    getSystemActivity(),
    getSystemSettings(),
    getDepartments(),
    getEmployees(),
    getTransactionSummary(),
  ])

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestión y configuración del sistema de nóminas</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Empleados</p>
                <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Departamentos</p>
                <p className="text-2xl font-bold text-green-900">{departments.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Actividades (30d)</p>
                <p className="text-2xl font-bold text-purple-900">{activity.total_activities}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Nómina Neta</p>
                <p className="text-2xl font-bold text-orange-900">₡{transactionSummary.net_amount.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-600" />
              Configuraciones del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gestionar configuraciones generales, empresa y seguridad</p>
            <Link href="/admin/settings">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Configurar Sistema</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Registro de Auditoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Ver historial de actividades y cambios en el sistema</p>
            <Link href="/admin/audit">
              <Button className="w-full bg-green-600 hover:bg-green-700">Ver Auditoría</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-purple-600" />
              Respaldo de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Crear respaldos y restaurar datos del sistema</p>
            <Link href="/admin/backup">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Gestionar Respaldos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Base de Datos</span>
                <Badge className="bg-green-100 text-green-800">Conectada</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Autenticación</span>
                <Badge className="bg-green-100 text-green-800">Activa</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Último Respaldo</span>
                <Badge className="bg-blue-100 text-blue-800">Hoy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Configuraciones</span>
                <Badge className="bg-green-100 text-green-800">{settings.length} activas</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(activity.activity_by_action)
                .slice(0, 5)
                .map(([action, count]) => (
                  <div key={action} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{action}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
