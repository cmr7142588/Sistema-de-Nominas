"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, X, User, DollarSign } from "lucide-react"
import type { Transaction, CreateTransactionData, Employee, IncomeType, DeductionType } from "@/lib/database/types"

interface TransactionFormProps {
  employees: Employee[]
  incomeTypes: IncomeType[]
  deductionTypes: DeductionType[]
  transaction?: Transaction
}

export default function TransactionForm({ employees, incomeTypes, deductionTypes, transaction }: TransactionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const currentDate = new Date()
  const [formData, setFormData] = useState<CreateTransactionData>({
    employee_id: transaction?.employee_id || 0,
    type_id: transaction?.type_id || 0,
    transaction_type: transaction?.transaction_type || ("Ingreso" as "Ingreso" | "Deduccion"),
    amount: transaction?.amount || 0,
    transaction_date: transaction?.transaction_date || currentDate.toISOString().split("T")[0],
    period_month: transaction?.period_month || currentDate.getMonth() + 1,
    period_year: transaction?.period_year || currentDate.getFullYear(),
    description: transaction?.description || "",
  })

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    if (formData.employee_id) {
      const employee = employees.find((emp) => emp.id === formData.employee_id)
      setSelectedEmployee(employee || null)
    }
  }, [formData.employee_id, employees])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate required fields
    if (!formData.employee_id || !formData.type_id || !formData.amount) {
      setError("Todos los campos marcados con * son requeridos")
      setLoading(false)
      return
    }

    if (formData.amount <= 0) {
      setError("El monto debe ser mayor a cero")
      setLoading(false)
      return
    }

    try {
      const url = transaction ? `/api/transactions/${transaction.id}` : "/api/transactions"
      const method = transaction ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar transacción")
      }

      router.push("/transactions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const availableTypes = formData.transaction_type === "Ingreso" ? incomeTypes : deductionTypes
  const selectedType = availableTypes.find((type) => type.id === formData.type_id)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employee_id">Empleado *</Label>
          <Select
            value={formData.employee_id.toString()}
            onValueChange={(value) => setFormData({ ...formData, employee_id: Number.parseInt(value), type_id: 0 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar empleado" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name} - {employee.cedula}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transaction_type">Tipo de Transacción *</Label>
          <Select
            value={formData.transaction_type}
            onValueChange={(value: "Ingreso" | "Deduccion") =>
              setFormData({ ...formData, transaction_type: value, type_id: 0 })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ingreso">Ingreso</SelectItem>
              <SelectItem value="Deduccion">Deducción</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedEmployee && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <User className="h-4 w-4" />
              <div>
                <p>
                  <strong>{selectedEmployee.name}</strong> - {selectedEmployee.department?.name}
                </p>
                <p>Puesto: {selectedEmployee.position?.name}</p>
                <p className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Salario: ₡{selectedEmployee.monthly_salary.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type_id">
            {formData.transaction_type === "Ingreso" ? "Tipo de Ingreso" : "Tipo de Deducción"} *
          </Label>
          <Select
            value={formData.type_id.toString()}
            onValueChange={(value) => setFormData({ ...formData, type_id: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Seleccionar tipo de ${formData.transaction_type.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                  {type.depends_on_salary && " (Depende del salario)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Monto *</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {selectedType && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-700">
              <strong>{selectedType.name}:</strong> {selectedType.description || "Sin descripción"}
            </p>
            {selectedType.depends_on_salary && selectedEmployee && (
              <p className="text-xs text-gray-600 mt-1">
                Este tipo depende del salario base (₡{selectedEmployee.monthly_salary.toLocaleString()})
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="transaction_date">Fecha de Transacción *</Label>
          <Input
            id="transaction_date"
            type="date"
            value={formData.transaction_date}
            onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="period_month">Mes del Período *</Label>
          <Select
            value={formData.period_month.toString()}
            onValueChange={(value) => setFormData({ ...formData, period_month: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {new Date(2024, i).toLocaleDateString("es", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period_year">Año del Período *</Label>
          <Select
            value={formData.period_year.toString()}
            onValueChange={(value) => setFormData({ ...formData, period_year: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => (
                <SelectItem key={currentDate.getFullYear() - i} value={(currentDate.getFullYear() - i).toString()}>
                  {currentDate.getFullYear() - i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción adicional de la transacción..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {transaction ? "Actualizar" : "Registrar"} Transacción
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
