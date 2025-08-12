import { getDepartments } from "@/lib/database/departments"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Building2 } from "lucide-react"
import Link from "next/link"
import DepartmentCard from "@/components/department-card"

export default async function DepartmentsPage() {
  const departments = await getDepartments()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Departamentos</h1>
            <p className="text-gray-600">Administra los departamentos de la organización</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/departments/positions">
              <Button variant="outline" className="bg-white">
                <Building2 className="h-4 w-4 mr-2" />
                Gestionar Puestos
              </Button>
            </Link>
            <Link href="/departments/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Departamento
              </Button>
            </Link>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </div>

        {departments.length === 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Building2 className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay departamentos</h3>
              <p className="text-gray-600 mb-4">Comienza agregando tu primer departamento</p>
              <Link href="/departments/new">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Departamento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
