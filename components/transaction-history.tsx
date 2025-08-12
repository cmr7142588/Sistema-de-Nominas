"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { History, Filter, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import type { Transaction } from "@/lib/database/types"

interface TransactionHistoryProps {
  employeeId: number
  transactions: Transaction[]
}

export default function TransactionHistory({ employeeId, transactions }: TransactionHistoryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    transactionType: searchParams.get("transactionType") || "all",
    periodMonth: searchParams.get("periodMonth") || "",
    periodYear: searchParams.get("periodYear") || "",
  })

  const applyFilters = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      }
    })
    router.push(`/employees/${employeeId}?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      transactionType: "all",
      periodMonth: "",
      periodYear: "",
    })
    router.push(`/employees/${employeeId}`)
  }

  const totalIncomes = transactions
    .filter((t) => t.transaction_type === "Ingreso")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalDeductions = transactions
    .filter((t) => t.transaction_type === "Deduccion")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const getTransactionTypeColor = (type: string) => {
    return type === "Ingreso" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-blue-100 text-blue-800"
      case "Procesado":
        return "bg-green-100 text-green-800"
      case "Anulado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Historial de Transacciones
          </CardTitle>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Ingresos</p>
                  <p className="text-2xl font-bold text-green-900">₡{totalIncomes.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Total Deducciones</p>
                  <p className="text-2xl font-bold text-red-900">₡{totalDeductions.toLocaleString()}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Neto</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₡{(totalIncomes - totalDeductions).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="bg-gray-50 border-gray-200 mb-6">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionType">Tipo</Label>
                  <Select
                    value={filters.transactionType}
                    onValueChange={(value) => setFilters({ ...filters, transactionType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Ingreso">Ingresos</SelectItem>
                      <SelectItem value="Deduccion">Deducciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodMonth">Mes</Label>
                  <Select
                    value={filters.periodMonth}
                    onValueChange={(value) => setFilters({ ...filters, periodMonth: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {new Date(2024, i).toLocaleDateString("es", { month: "long" })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodYear">Año</Label>
                  <Select
                    value={filters.periodYear}
                    onValueChange={(value) => setFilters({ ...filters, periodYear: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Array.from({ length: 5 }, (_, i) => (
                        <SelectItem key={2024 - i} value={(2024 - i).toString()}>
                          {2024 - i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar
                </Button>
                <Button onClick={applyFilters}>Aplicar Filtros</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay transacciones</h3>
              <p className="text-gray-600">
                {searchParams.toString()
                  ? "No se encontraron transacciones con los filtros aplicados"
                  : "Este empleado no tiene transacciones registradas"}
              </p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getTransactionTypeColor(transaction.transaction_type)}>
                          {transaction.transaction_type}
                        </Badge>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </div>
                      <h4 className="font-medium text-gray-900">
                        {transaction.transaction_type === "Ingreso"
                          ? transaction.income_type?.name
                          : transaction.deduction_type?.name}
                      </h4>
                      {transaction.description && (
                        <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </span>
                        <span>
                          Período: {transaction.period_month}/{transaction.period_year}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-semibold ${
                          transaction.transaction_type === "Ingreso" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.transaction_type === "Ingreso" ? "+" : "-"}₡
                        {Number(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
