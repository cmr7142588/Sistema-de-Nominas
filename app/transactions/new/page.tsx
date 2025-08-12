import { getEmployees } from "@/lib/database/employees"
import { getIncomeTypes, getDeductionTypes } from "@/lib/database/income-deductions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import TransactionForm from "@/components/transaction-form"

export default async function NewTransactionPage() {
  const [employees, incomeTypes, deductionTypes] = await Promise.all([
    getEmployees(),
    getIncomeTypes(true), // Only active types
    getDeductionTypes(true), // Only active types
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/transactions" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Transacción</h1>
            <p className="text-gray-600">Registrar un nuevo ingreso o deducción</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white shadow-lg border-0 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Información de la Transacción</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm employees={employees} incomeTypes={incomeTypes} deductionTypes={deductionTypes} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
