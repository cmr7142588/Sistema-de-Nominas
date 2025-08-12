import { getIncomeTypeById } from "@/lib/database/income-deductions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import IncomeTypeForm from "@/components/income-type-form"

interface PageProps {
  params: { id: string }
}

export default async function EditIncomeTypePage({ params }: PageProps) {
  const incomeTypeId = Number.parseInt(params.id)

  if (Number.isNaN(incomeTypeId)) {
    notFound()
  }

  try {
    const incomeType = await getIncomeTypeById(incomeTypeId)

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/income-deductions" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Tipo de Ingreso</h1>
              <p className="text-gray-600">Modificar información de {incomeType.name}</p>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-white shadow-lg border-0 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Información del Tipo de Ingreso</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeTypeForm incomeType={incomeType} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
