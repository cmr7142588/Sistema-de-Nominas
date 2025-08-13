import { getDepartmentById, getDepartmentEmployees } from "@/lib/database/departments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MapPin, User, Edit, ArrowLeft, DollarSign } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface DepartmentDetailPageProps {
  params: { id: string }
}

export default async function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
  const departmentId = Number.parseInt(params.id)

  if (Number.isNaN(departmentId) || departmentId <= 0) {
    notFound()
  }

  try {
    const [department, employees] = await Promise.all([
      getDepartmentById(departmentId),
      getDepartmentEmployees(departmentId),
    ])

    if (!department) {
      notFound()
    }

    const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0)
    const avgSalary = employees.length > 0 ? totalSalary / employees.length : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/departments">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Departamentos
              </Button>
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-green-600" />
                  {department.name}
                </h1>
                <p className="text-gray-600">Información detallada del departamento</p>
              </div>
              <Link href={`/departments/${department.id}/edit`}>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Departamento
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Department Info */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-green-900">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Ubicación</p>
                      <p className="text-gray-900">{department.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Responsable</p>
                      <p className="text-gray-900">{department.responsible}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="bg-white shadow-lg border-0 mt-6">
                <CardHeader>
                  <CardTitle className="text-green-900">Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Empleados</span>
                    <Badge className="bg-green-100 text-green-800">{employees.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nómina Total</span>
                    <span className="font-semibold text-green-600">${totalSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Salario Promedio</span>
                    <span className="font-semibold text-green-600">${avgSalary.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Employees List */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Empleados del Departamento
                  </CardTitle>
                  <CardDescription>
                    {employees.length} empleado{employees.length !== 1 ? "s" : ""} asignado
                    {employees.length !== 1 ? "s" : ""} a este departamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {employees.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No hay empleados asignados a este departamento</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {employees.map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <Link
                                href={`/employees/${employee.id}`}
                                className="font-medium text-green-600 hover:text-green-800"
                              >
                                {employee.name}
                              </Link>
                              <p className="text-sm text-gray-600">{employee.cedula}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              {employee.position}
                            </Badge>
                            <p className="text-sm font-semibold text-green-600 flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {employee.salary.toLocaleString()}
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
    console.error("Error loading department:", error)
    notFound()
  }
}
