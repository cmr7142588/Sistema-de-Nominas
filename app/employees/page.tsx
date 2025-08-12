import { getEmployees, getDepartments, getPositions } from "@/lib/database/employees"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Eye, Edit } from "lucide-react"
import Link from "next/link"
import EmployeeFilters from "@/components/employee-filters"
import EmployeeSearch from "@/components/employee-search"

interface PageProps {
  searchParams: {
    department_id?: string
    position_id?: string
    status?: string
    search?: string
  }
}

export default async function EmployeesPage({ searchParams }: PageProps) {
  const filters = {
    department_id: searchParams.department_id ? Number.parseInt(searchParams.department_id) : undefined,
    position_id: searchParams.position_id ? Number.parseInt(searchParams.position_id) : undefined,
    status: searchParams.status,
    search: searchParams.search,
  }

  const [employees, departments, positions] = await Promise.all([
    getEmployees(filters),
    getDepartments(),
    getPositions(),
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800"
      case "Inactivo":
        return "bg-gray-100 text-gray-800"
      case "Suspendido":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Empleados</h1>
            <p className="text-gray-600">Administra la información de todos los empleados</p>
          </div>
          <Link href="/employees/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <EmployeeSearch />
              <EmployeeFilters departments={departments} positions={positions} />
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {employees.length} empleado{employees.length !== 1 ? "s" : ""}
            {filters.search && ` para "${filters.search}"`}
          </p>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <Card key={employee.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{employee.name}</CardTitle>
                    <p className="text-sm text-gray-600">Cédula: {employee.cedula}</p>
                  </div>
                  <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Departamento</p>
                  <p className="text-sm text-gray-600">{employee.department?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Puesto</p>
                  <p className="text-sm text-gray-600">{employee.position?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Salario Mensual</p>
                  <p className="text-sm font-semibold text-green-600">₡{employee.monthly_salary.toLocaleString()}</p>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <Link href={`/employees/${employee.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </Link>
                  <Link href={`/employees/${employee.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {employees.length === 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron empleados</h3>
              <p className="text-gray-600 mb-4">
                {filters.search || filters.department_id || filters.position_id || filters.status
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza agregando tu primer empleado"}
              </p>
              <Link href="/employees/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Empleado
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
