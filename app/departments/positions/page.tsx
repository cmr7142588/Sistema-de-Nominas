import { getPositions } from "@/lib/database/departments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Briefcase, DollarSign, Shield, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function PositionsPage() {
  const positions = await getPositions()

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center">
            <Link href="/departments" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Puestos</h1>
              <p className="text-gray-600">Administra los puestos de trabajo de la organización</p>
            </div>
          </div>
          <Link href="/departments/positions/new">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Puesto
            </Button>
          </Link>
        </div>

        {/* Positions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {positions.map((position) => (
            <Card key={position.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{position.name}</CardTitle>
                    </div>
                  </div>
                  <Badge className={getRiskLevelColor(position.risk_level)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {position.risk_level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Rango Salarial</p>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">
                      ₡{position.min_salary.toLocaleString()} - ₡{position.max_salary.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex space-x-2">
                    <Link href={`/departments/positions/${position.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {positions.length === 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Briefcase className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay puestos</h3>
              <p className="text-gray-600 mb-4">Comienza agregando tu primer puesto de trabajo</p>
              <Link href="/departments/positions/new">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Puesto
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
