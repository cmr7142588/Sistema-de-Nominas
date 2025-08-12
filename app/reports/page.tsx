import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPayrollSummary } from "@/lib/database/reports"
import { BarChart3, FileText, TrendingUp, Users, Building2, Briefcase, DollarSign } from "lucide-react"

async function PayrollSummaryCards() {
  const summary = await getPayrollSummary()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Total Empleados</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{summary.totalEmployees}</div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">Departamentos</CardTitle>
          <Building2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{summary.totalDepartments}</div>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900">Puestos</CardTitle>
          <Briefcase className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{summary.totalPositions}</div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-900">Transacciones</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{summary.totalTransactions}</div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-emerald-50 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-900">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900">${summary.totalIncome.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-900">Deducciones Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">${summary.totalDeductions.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reportes y Consultas</h1>
        <p className="text-slate-600">
          Visualiza estadísticas, genera reportes y realiza consultas avanzadas del sistema de nóminas.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <PayrollSummaryCards />
      </Suspense>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Building2 className="h-5 w-5" />
              Reportes por Departamento
            </CardTitle>
            <CardDescription>Genera reportes detallados de nómina agrupados por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports/departments">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Ver Reportes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Users className="h-5 w-5" />
              Reportes de Empleados
            </CardTitle>
            <CardDescription>Consulta reportes individuales detallados de cada empleado</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports/employees">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                Ver Reportes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <BarChart3 className="h-5 w-5" />
              Análisis de Transacciones
            </CardTitle>
            <CardDescription>Visualiza tendencias y patrones en las transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports/analytics">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Análisis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Accesos Rápidos</CardTitle>
          <CardDescription>Enlaces directos a las funcionalidades más utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href="/employees">
              <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">
                Gestión de Empleados
              </Badge>
            </Link>
            <Link href="/transactions">
              <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">
                Registro de Transacciones
              </Badge>
            </Link>
            <Link href="/departments">
              <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">
                Departamentos
              </Badge>
            </Link>
            <Link href="/income-deductions">
              <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200">
                Tipos de Ingresos/Deducciones
              </Badge>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
