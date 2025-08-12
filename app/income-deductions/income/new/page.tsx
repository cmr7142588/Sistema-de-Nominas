import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import IncomeTypeForm from "@/components/income-type-form"

export default function NewIncomeTypePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/income-deductions" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Tipo de Ingreso</h1>
            <p className="text-gray-600">Agregar un nuevo tipo de ingreso al sistema</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white shadow-lg border-0 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Información del Tipo de Ingreso</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeTypeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
