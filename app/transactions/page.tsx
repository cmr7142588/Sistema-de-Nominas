import { getTransactions, getTransactionSummary } from "@/lib/database/transactions"
import { getDepartments } from "@/lib/database/departments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react"
import Link from "next/link"
import TransactionFilters from "@/components/transaction-filters"
import TransactionCard from "@/components/transaction-card"

interface PageProps {
  searchParams: {
    employee_id?: string
    transaction_type?: string
    period_month?: string
    period_year?: string
    start_date?: string
    end_date?: string
    status?: string
    department_id?: string
  }
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const filters = {
    employee_id: searchParams.employee_id ? Number.parseInt(searchParams.employee_id) : undefined,
    transaction_type: searchParams.transaction_type as "Ingreso" | "Deduccion" | undefined,
    period_month: searchParams.period_month ? Number.parseInt(searchParams.period_month) : undefined,
    period_year: searchParams.period_year ? Number.parseInt(searchParams.period_year) : undefined,
    start_date: searchParams.start_date,
    end_date: searchParams.end_date,
    status: searchParams.status,
    department_id: searchParams.department_id ? Number.parseInt(searchParams.department_id) : undefined,
  }

  const [transactions, departments, summary] = await Promise.all([
    getTransactions(filters),
    getDepartments(),
    getTransactionSummary(filters),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Transacciones</h1>
            <p className="text-gray-600">Registra y gestiona ingresos y deducciones de empleados</p>
          </div>
          <Link href="/transactions/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Transacción
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₡{summary.total_incomes.toLocaleString()}</div>
              <p className="text-xs text-gray-500">{summary.income_count} transacciones</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deducciones</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₡{summary.total_deductions.toLocaleString()}</div>
              <p className="text-xs text-gray-500">{summary.deduction_count} transacciones</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monto Neto</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₡{summary.net_amount.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Diferencia total</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Transacciones</CardTitle>
              <Receipt className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{transactions.length}</div>
              <p className="text-xs text-gray-500">En el período seleccionado</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle>Filtros de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionFilters departments={departments} />
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {transactions.length} transacción{transactions.length !== 1 ? "es" : ""}
          </p>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>

        {transactions.length === 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Receipt className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron transacciones</h3>
              <p className="text-gray-600 mb-4">
                {Object.values(filters).some((f) => f !== undefined)
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza registrando tu primera transacción"}
              </p>
              <Link href="/transactions/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Transacción
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
