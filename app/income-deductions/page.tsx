import { getIncomeTypes, getDeductionTypes } from "@/lib/database/income-deductions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import IncomeTypeCard from "@/components/income-type-card"
import DeductionTypeCard from "@/components/deduction-type-card"

export default async function IncomeDeductionsPage() {
  const [incomeTypes, deductionTypes] = await Promise.all([getIncomeTypes(), getDeductionTypes()])

  const activeIncomeTypes = incomeTypes.filter((type) => type.status === "Activo").length
  const activeDeductionTypes = deductionTypes.filter((type) => type.status === "Activo").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tipos de Ingresos y Deducciones</h1>
            <p className="text-gray-600">Configura los tipos de ingresos y deducciones para las transacciones</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tipos de Ingresos Activos</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeIncomeTypes}</div>
              <p className="text-xs text-gray-500">de {incomeTypes.length} total</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tipos de Deducciones Activos</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeDeductionTypes}</div>
              <p className="text-xs text-gray-500">de {deductionTypes.length} total</p>
            </CardContent>
          </Card>
        </div>

        {/* Income Types Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Tipos de Ingresos</h2>
            </div>
            <Link href="/income-deductions/income/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Ingreso
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomeTypes.map((incomeType) => (
              <IncomeTypeCard key={incomeType.id} incomeType={incomeType} />
            ))}
          </div>

          {incomeTypes.length === 0 && (
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <TrendingUp className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tipos de ingresos</h3>
                <p className="text-gray-600 mb-4">Comienza agregando tu primer tipo de ingreso</p>
                <Link href="/income-deductions/income/new">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Tipo de Ingreso
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Deduction Types Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Tipos de Deducciones</h2>
            </div>
            <Link href="/income-deductions/deduction/new">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Deducción
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deductionTypes.map((deductionType) => (
              <DeductionTypeCard key={deductionType.id} deductionType={deductionType} />
            ))}
          </div>

          {deductionTypes.length === 0 && (
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <TrendingDown className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tipos de deducciones</h3>
                <p className="text-gray-600 mb-4">Comienza agregando tu primer tipo de deducción</p>
                <Link href="/income-deductions/deduction/new">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Tipo de Deducción
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
