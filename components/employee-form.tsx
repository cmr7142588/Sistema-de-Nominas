"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, X } from "lucide-react"
import type { Employee, CreateEmployeeData } from "@/lib/database/types"

interface EmployeeFormProps {
  departments: any[]
  positions: any[]
  employee?: Employee
}

export default function EmployeeForm({ departments, positions, employee }: EmployeeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cedulaError, setCedulaError] = useState("")

  const [formData, setFormData] = useState<CreateEmployeeData>({
    cedula: employee?.cedula || "",
    name: employee?.name || "",
    department_id: employee?.department_id || 0,
    position_id: employee?.position_id || 0,
    monthly_salary: employee?.monthly_salary || 0,
    payroll_id: employee?.payroll_id || "",
    hire_date: employee?.hire_date || new Date().toISOString().split("T")[0],
  })

  const validateCedula = (cedula: string): boolean => {
    const cedulaRegex = /^\d{3}-\d{7}-\d{1}$/
    return cedulaRegex.test(cedula)
  }

  const formatCedula = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    const limitedNumbers = numbers.slice(0, 11)

    if (limitedNumbers.length <= 3) {
      return limitedNumbers
    } else if (limitedNumbers.length <= 10) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 10)}-${limitedNumbers.slice(10)}`
    }
  }

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCedula(e.target.value)
    setFormData({ ...formData, cedula: formattedValue })

    if (formattedValue && !validateCedula(formattedValue)) {
      setCedulaError("Cédula inválida. Use el formato 000-0000000-0")
    } else {
      setCedulaError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!validateCedula(formData.cedula)) {
      setError("Por favor ingrese una cédula válida en el formato 000-0000000-0")
      setLoading(false)
      return
    }

    try {
      const url = employee ? `/api/employees/${employee.id}` : "/api/employees"
      const method = employee ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar empleado")
      }

      const savedEmployee = await response.json()

      if (employee) {
        router.push(`/employees/${savedEmployee.id}`)
      } else {
        router.push("/employees")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const selectedPosition = positions.find((p) => p.id === formData.position_id)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula *</Label>
          <Input
            id="cedula"
            value={formData.cedula}
            onChange={handleCedulaChange}
            placeholder="000-0000000-0"
            required
            maxLength={13}
            className={cedulaError ? "border-red-500 focus:border-red-500" : ""}
          />
          {cedulaError && <p className="text-sm text-red-600 mt-1">{cedulaError}</p>}
          <p className="text-xs text-gray-500">Formato: 000-0000000-0 (11 dígitos)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payroll_id">ID de Nómina</Label>
          <Input
            id="payroll_id"
            value={formData.payroll_id}
            onChange={(e) => setFormData({ ...formData, payroll_id: e.target.value })}
            placeholder="EMP001"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre Completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Juan Pérez González"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="department">Departamento *</Label>
          <Select
            value={formData.department_id.toString()}
            onValueChange={(value) => setFormData({ ...formData, department_id: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Puesto *</Label>
          <Select
            value={formData.position_id.toString()}
            onValueChange={(value) => setFormData({ ...formData, position_id: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar puesto" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.id} value={pos.id.toString()}>
                  {pos.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPosition && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <p className="text-sm text-blue-800">
              <strong>Rango salarial para {selectedPosition.name}:</strong> ₡
              {selectedPosition.min_salary.toLocaleString()} - ₡{selectedPosition.max_salary.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">Nivel de riesgo: {selectedPosition.risk_level}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="salary">Salario Mensual *</Label>
          <Input
            id="salary"
            type="number"
            min="0"
            step="0.01"
            value={formData.monthly_salary}
            onChange={(e) => setFormData({ ...formData, monthly_salary: Number.parseFloat(e.target.value) || 0 })}
            placeholder="50000.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hire_date">Fecha de Contratación *</Label>
          <Input
            id="hire_date"
            type="date"
            value={formData.hire_date}
            onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {employee ? "Actualizar" : "Crear"} Empleado
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
