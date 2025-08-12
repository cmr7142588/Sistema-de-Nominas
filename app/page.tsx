import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Briefcase, DollarSign, FileText, TrendingUp } from "lucide-react"

export default async function HomePage() {
  const supabase = createClient()

  // Get basic statistics
  const [employeesResult, departmentsResult, transactionsResult] = await Promise.all([
    supabase.from("employees").select("id", { count: "exact" }),
    supabase.from("departments").select("id", { count: "exact" }),
    supabase.from("transactions").select("amount").eq("status", "Activo"),
  ])

  const employeeCount = employeesResult.count || 0
  const departmentCount = departmentsResult.count || 0
  const totalTransactions = transactionsResult.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Nóminas</h1>
          <p className="text-lg text-gray-600">Gestión integral de empleados, departamentos y transacciones</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{employeeCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Departamentos</CardTitle>
              <Building2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{departmentCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Transacciones Activas</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₡{totalTransactions.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/employees">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Gestión de Empleados</CardTitle>
                    <CardDescription>Administrar empleados y sus datos</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/departments">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Departamentos</CardTitle>
                    <CardDescription>Gestionar departamentos y puestos</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/income-deductions">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ingresos y Deducciones</CardTitle>
                    <CardDescription>Configurar tipos de ingresos y deducciones</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/transactions">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Transacciones</CardTitle>
                    <CardDescription>Registrar ingresos y deducciones</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Reportes</CardTitle>
                    <CardDescription>Consultas y reportes de nómina</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Análisis</CardTitle>
                    <CardDescription>Estadísticas y análisis de nómina</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
