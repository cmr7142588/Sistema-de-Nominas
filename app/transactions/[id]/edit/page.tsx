import { getTransactionById } from "@/lib/database/transactions"
import { getEmployees } from "@/lib/database/employees"
import { getIncomeTypes, getDeductionTypes } from "@/lib/database/income-deductions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import TransactionForm from "@/components/transaction-form"

interface PageProps {
  params: { id: string }
}

export default async function EditTransactionPage({ params }: PageProps) {
  const transactionId = Number.parseInt(params.id)

  if (Number.isNaN(transactionId)) {
    notFound()
  }

  try {
    const [transaction, employees, incomeTypes, deductionTypes] = await Promise.all([
      getTransactionById(transactionId),
      getEmployees(),
      getIncomeTypes(true),
      getDeductionTypes(true),
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Transacción</h1>
              <p className="text-gray-600">
                Modificar {transaction.transaction_type.toLowerCase()} de {transaction.employee?.name}
              </p>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-white shadow-lg border-0 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Información de la Transacción</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionForm
                employees={employees}
                incomeTypes={incomeTypes}
                deductionTypes={deductionTypes}
                transaction={transaction}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
