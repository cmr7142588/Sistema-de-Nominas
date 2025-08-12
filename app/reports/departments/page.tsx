import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getDepartmentReports } from "@/lib/database/reports"
import { Building2, Users, DollarSign, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

async function DepartmentReportsList() {
  const reports = await getDepartmentReports()

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay departamentos</h3>
          <p className="text-slate-600 text-center">No se encontraron departamentos para generar reportes.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {reports.map((dept) => (
        <Card key={dept.id} className="border-blue-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {dept.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  <span className="font-medium">Ubicación:</span> {dept.location} •
                  <span className="font-medium"> Responsable:</span> {dept.responsible}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-600">Empleados</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{dept.employeeCount}</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Ingresos</span>
                </div>
                <div className="text-2xl font-bold text-green-900">${dept.totalIncome.toLocaleString()}</div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Deducciones</span>
                </div>
                <div className="text-2xl font-bold text-red-900">${dept.totalDeductions.toLocaleString()}</div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Nómina Neta</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">${dept.netPayroll.toLocaleString()}</div>
              </div>
            </div>

            {/* Employee Details */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Detalle por Empleado</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 font-medium text-slate-600">Empleado</th>
                      <th className="text-left py-2 font-medium text-slate-600">Cédula</th>
                      <th className="text-left py-2 font-medium text-slate-600">Puesto</th>
                      <th className="text-right py-2 font-medium text-slate-600">Salario</th>
                      <th className="text-right py-2 font-medium text-slate-600">Ingresos</th>
                      <th className="text-right py-2 font-medium text-slate-600">Deducciones</th>
                      <th className="text-right py-2 font-medium text-slate-600">Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dept.employees.map((emp) => (
                      <tr key={emp.id} className="border-b border-slate-100">
                        <td className="py-3">
                          <Link href={`/employees/${emp.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                            {emp.name}
                          </Link>
                        </td>
                        <td className="py-3 text-slate-600">{emp.cedula}</td>
                        <td className="py-3">
                          <Badge variant="secondary">{emp.position}</Badge>
                        </td>
                        <td className="py-3 text-right font-medium">${emp.salary.toLocaleString()}</td>
                        <td className="py-3 text-right text-green-600 font-medium">
                          ${emp.totalIncome.toLocaleString()}
                        </td>
                        <td className="py-3 text-right text-red-600 font-medium">
                          ${emp.totalDeductions.toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-bold">${emp.netPay.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DepartmentReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/reports">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Reportes
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reportes por Departamento</h1>
        <p className="text-slate-600">
          Visualiza el desglose completo de nómina por cada departamento de la organización.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4 mb-6">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="bg-slate-50 p-4 rounded-lg">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-32 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <DepartmentReportsList />
      </Suspense>
    </div>
  )
}
