import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPayrollSummary, getDepartmentAnalytics } from "@/lib/database/reports"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Users, DollarSign, Briefcase } from "lucide-react"
import Link from "next/link"

async function AnalyticsCharts() {
  const [summary, departmentAnalytics] = await Promise.all([getPayrollSummary(), getDepartmentAnalytics()])

  const departmentData = departmentAnalytics.map((dept) => ({
    name: dept.department_name.substring(0, 10),
    employees: dept.employee_count,
    totalSalary: dept.total_salary,
    avgSalary: dept.avg_salary,
  }))

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Empleados Activos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{summary.totalEmployees}</div>
            <p className="text-xs text-blue-700 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Nómina Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${summary.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-green-700 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Deducciones</CardTitle>
            <TrendingDown className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">${summary.totalDeductions.toLocaleString()}</div>
            <p className="text-xs text-purple-700 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -3% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Salario Promedio</CardTitle>
            <Briefcase className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              ${Math.round(summary.totalIncome / summary.totalEmployees).toLocaleString()}
            </div>
            <p className="text-xs text-orange-700 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Empleados por Departamento</CardTitle>
            <CardDescription>Distribución de personal por área</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="employees" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución Salarial</CardTitle>
            <CardDescription>Masa salarial por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalSalary"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Total Salario"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Details */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis por Departamento</CardTitle>
          <CardDescription>Métricas detalladas de cada departamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentAnalytics.map((dept, index) => (
              <div key={dept.department_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <h3 className="font-semibold">{dept.department_name}</h3>
                    <p className="text-sm text-gray-600">{dept.employee_count} empleados</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${Number(dept.total_salary).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Promedio: ${Number(dept.avg_salary).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Análisis y Estadísticas</h1>
              <p className="text-slate-600">Dashboard completo de métricas y tendencias del sistema de nóminas</p>
            </div>
            <Link href="/">
              <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
                ← Volver al inicio
              </Badge>
            </Link>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
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
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }
        >
          <AnalyticsCharts />
        </Suspense>
      </div>
    </div>
  )
}
