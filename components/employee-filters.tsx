"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"

interface EmployeeFiltersProps {
  departments: any[]
  positions: any[]
}

export default function EmployeeFilters({ departments, positions }: EmployeeFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/employees?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/employees")
  }

  const hasFilters = searchParams.get("department_id") || searchParams.get("position_id") || searchParams.get("status")

  return (
    <>
      <Select
        value={searchParams.get("department_id") || "all"}
        onValueChange={(value) => updateFilter("department_id", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos los departamentos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los departamentos</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id.toString()}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("position_id") || "all"}
        onValueChange={(value) => updateFilter("position_id", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos los puestos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los puestos</SelectItem>
          {positions.map((pos) => (
            <SelectItem key={pos.id} value={pos.id.toString()}>
              {pos.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={searchParams.get("status") || "all"} onValueChange={(value) => updateFilter("status", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="Activo">Activo</SelectItem>
          <SelectItem value="Inactivo">Inactivo</SelectItem>
          <SelectItem value="Suspendido">Suspendido</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Limpiar Filtros
        </Button>
      )}
    </>
  )
}
