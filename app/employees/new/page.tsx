import { getDepartments, getPositions } from "@/lib/database/employees"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import EmployeeForm from "@/components/employee-form"

export default async function NewEmployeePage() {
  try {
    console.log("Fetching departments and positions...")
    const [departments, positions] = await Promise.all([getDepartments(), getPositions()])

    console.log("Departments:", departments?.length || 0)
    console.log("Positions:", positions?.length || 0)

    if (!departments || departments.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se encontraron departamentos. Por favor, crea al menos un departamento antes de agregar empleados.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )
    }

    if (!positions || positions.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se encontraron puestos. Por favor, crea al menos un puesto antes de agregar empleados.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/employees" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Empleado</h1>
              <p className="text-gray-600">Agregar un nuevo empleado al sistema</p>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-white shadow-lg border-0 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Información del Empleado</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeForm departments={departments} positions={positions} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in NewEmployeePage:", error)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link href="/employees" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Error</h1>
              <p className="text-gray-600">No se pudo cargar la página</p>
            </div>
          </div>

          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar los datos necesarios: {error instanceof Error ? error.message : "Error desconocido"}
              <br />
              <br />
              Posibles soluciones:
              <ul className="list-disc list-inside mt-2">
                <li>Verifica que las tablas de departamentos y puestos existan</li>
                <li>Asegúrate de que la base de datos esté conectada</li>
                <li>Revisa la consola para más detalles</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }
}
