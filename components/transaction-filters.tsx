"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { X } from "lucide-react"

interface TransactionFiltersProps {
  departments: any[]
}

export default function TransactionFilters({ departments }: TransactionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    transaction_type: searchParams.get("transaction_type") || "all",
    period_month: searchParams.get("period_month") || "",
    period_year: searchParams.get("period_year") || "",
    start_date: searchParams.get("start_date") || "",
    end_date: searchParams.get("end_date") || "",
    status: searchParams.get("status") || "all",
    department_id: searchParams.get("department_id") || "all",
  })

  const applyFilters = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      }
    })
    router.push(`/transactions?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      transaction_type: "all",
      period_month: "",
      period_year: "",
      start_date: "",
      end_date: "",
      status: "all",
      department_id: "all",
    })
    router.push("/transactions")
  }

  const hasFilters = Object.values(filters).some((value) => value && value !== "all")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Transacción</Label>
          <Select
            value={filters.transaction_type}
            onValueChange={(value) => setFilters({ ...filters, transaction_type: value })}
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
          <Label>Departamento</Label>
          <Select
            value={filters.department_id}
            onValueChange={(value) => setFilters({ ...filters, department_id: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Mes</Label>
          <Select
            value={filters.period_month}
            onValueChange={(value) => setFilters({ ...filters, period_month: value })}
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
          <Label>Año</Label>
          <Select value={filters.period_year} onValueChange={(value) => setFilters({ ...filters, period_year: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Fecha Inicio</Label>
          <Input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Fecha Fin</Label>
          <Input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Procesado">Procesado</SelectItem>
              <SelectItem value="Anulado">Anulado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpiar Filtros
          </Button>
        )}
        <Button onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-700">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  )
}
