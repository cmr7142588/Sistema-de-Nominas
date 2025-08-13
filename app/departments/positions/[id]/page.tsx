import { getPositionById, getPositionEmployees } from "@/lib/database/departments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, Shield, DollarSign, Edit, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PositionDetailPageProps {
  params: { id: string }
}

export default async function PositionDetailPage({ params }: PositionDetailPageProps) {
  const positionId = Number.parseInt(params.id)

  if (Number.isNaN(positionId) || positionId <= 0) {
    notFound()
  }

  try {
    const [position, employees] = await Promise.all([getPositionById(positionId), getPositionEmployees(positionId)])

    if (!position) {
      notFound()
    }

    const getRiskLevelColor = (riskLevel: string) => {
      switch (riskLevel) {
        case "Alto":
          return "bg-red-100 text-red-800"
        case "Medio":
          return "bg-yellow-100 text-yellow-800"
        case "Bajo":
          return "bg-green-100 text-green-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/departments/positions">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Puestos
              </Button>
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-purple-600" />
                  {position.name}
                </h1>
                <p className="text-gray-600">Información detallada del puesto</p>
              </div>
              <Link href={`/departments/positions/${position.id}/edit`}>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Puesto
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Position Info */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-purple-900">Información del Puesto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nivel de Riesgo</span>
                    <Badge className={getRiskLevelColor(position.risk_level)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {position.risk_level}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Rango Salarial</p>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      <span className="font-semibold text-purple-600">
                        ₡{position.min_salary.toLocaleString()} - ₡{position.max_salary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="bg-white shadow-lg border-0 mt-6">
                <CardHeader>
                  <CardTitle className="text-purple-900">Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Empleados Activos</span>
                    <Badge className="bg-purple-100 text-purple-800">{employees.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Salario Promedio</span>
                    <span className="font-semibold text-purple-600">
                      ₡
                      {employees.length > 0
                        ? Math.round(
                            employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length,
                          ).toLocaleString()
                        : "0"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Employees List */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-purple-900 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Empleados en este Puesto
                  </CardTitle>
                  <CardDescription>
                    {employees.length} empleado{employees.length !== 1 ? "s" : ""} con este puesto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {employees.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No hay empleados asignados a este puesto</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {employees.map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <Link
                                href={`/employees/${employee.id}`}
                                className="font-medium text-purple-600 hover:text-purple-800"
                              >
                                {employee.name}
                              </Link>
                              <p className="text-sm text-gray-600">{employee.cedula}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              {employee.department}
                            </Badge>
                            <p className="text-sm font-semibold text-purple-600 flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />₡{employee.salary.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading position:", error)
    notFound()
  }
}
