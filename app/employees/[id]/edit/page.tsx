import { getEmployeeById, getDepartments, getPositions } from "@/lib/database/employees"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import EmployeeForm from "@/components/employee-form"

interface PageProps {
  params: { id: string }
}

export default async function EditEmployeePage({ params }: PageProps) {
  const employeeId = Number.parseInt(params.id)

  if (Number.isNaN(employeeId)) {
    notFound()
  }

  try {
    const [employee, departments, positions] = await Promise.all([
      getEmployeeById(employeeId),
      getDepartments(),
      getPositions(),
    ])

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href={`/employees/${employee.id}`} className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Empleado</h1>
              <p className="text-gray-600">Modificar información de {employee.name}</p>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-white shadow-lg border-0 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Información del Empleado</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeForm departments={departments} positions={positions} employee={employee} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
