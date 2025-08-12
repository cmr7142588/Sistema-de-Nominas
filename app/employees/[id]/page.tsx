import { getEmployeeById, getEmployeeTransactions } from "@/lib/database/employees"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, DollarSign, Calendar, Building2, Briefcase, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import TransactionHistory from "@/components/transaction-history"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PageProps {
  params: { id: string }
  searchParams: {
    startDate?: string
    endDate?: string
    transactionType?: string
    periodMonth?: string
    periodYear?: string
  }
}

export default async function EmployeeDetailPage({ params, searchParams }: PageProps) {
  if (params.id === "new") {
    redirect("/employees/new")
  }

  const employeeId = Number.parseInt(params.id)

  if (Number.isNaN(employeeId) || employeeId <= 0) {
    console.error("Invalid employee ID:", params.id)
    notFound()
  }

  let employee
  let transactions = []
  let employeeError = null
  let transactionError = null

  try {
    console.log("Fetching employee with ID:", employeeId)
    employee = await getEmployeeById(employeeId)

    if (!employee) {
      console.error("Employee not found in database:", employeeId)
      notFound()
    }

    console.log("Employee fetched successfully:", employee.name)
  } catch (error) {
    console.error("Error fetching employee:", error)
    employeeError = error instanceof Error ? error.message : "Error desconocido al cargar empleado"

    // This allows us to see what's actually failing
  }

  if (employee) {
    try {
      const transactionFilters = {
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        transactionType: searchParams.transactionType as "Ingreso" | "Deduccion" | undefined,
        periodMonth: searchParams.periodMonth ? Number.parseInt(searchParams.periodMonth) : undefined,
        periodYear: searchParams.periodYear ? Number.parseInt(searchParams.periodYear) : undefined,
      }

      console.log("Fetching transactions for employee:", employeeId)
      transactions = await getEmployeeTransactions(employeeId, transactionFilters)
      console.log("Transactions fetched successfully:", transactions.length)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      transactionError = error instanceof Error ? error.message : "Error al cargar transacciones"
    }
  }

  if (employeeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link href="/employees" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Error al Cargar Empleado</h1>
              <p className="text-gray-600">No se pudo cargar la información del empleado</p>
            </div>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{employeeError}</AlertDescription>
          </Alert>

          <div className="mt-6">
            <Link href="/employees">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Empleados
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/employees" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h1>
              <p className="text-gray-600">Detalles del empleado y historial de transacciones</p>
            </div>
          </div>
          <Link href={`/employees/${employee.id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        {transactionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Error al cargar transacciones: {transactionError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Information */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Información Personal
                  </CardTitle>
                  <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Cédula</p>
                  <p className="text-sm text-gray-900">{employee.cedula}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">ID de Nómina</p>
                  <p className="text-sm text-gray-900">{employee.payroll_id || "No asignado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Fecha de Contratación</p>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(employee.hire_date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Información Laboral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Departamento</p>
                  <p className="text-sm text-gray-900">{employee.department?.name || "No asignado"}</p>
                  {employee.department?.physical_location && (
                    <p className="text-xs text-gray-600">{employee.department.physical_location}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Puesto</p>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {employee.position?.name || "No asignado"}
                  </p>
                  {employee.position?.risk_level && (
                    <Badge
                      variant="outline"
                      className={`mt-1 ${
                        employee.position.risk_level === "Alto"
                          ? "border-red-200 text-red-700"
                          : employee.position.risk_level === "Medio"
                            ? "border-yellow-200 text-yellow-700"
                            : "border-green-200 text-green-700"
                      }`}
                    >
                      Riesgo {employee.position.risk_level}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Salario Mensual</p>
                  <p className="text-lg font-semibold text-green-600 flex items-center">
                    <DollarSign className="h-5 w-5 mr-1" />₡{employee.monthly_salary.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <TransactionHistory employeeId={employeeId} transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
