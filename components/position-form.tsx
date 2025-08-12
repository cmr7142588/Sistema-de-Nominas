"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, X } from "lucide-react"
import type { Position } from "@/lib/database/types"

interface PositionFormProps {
  position?: Position
}

export default function PositionForm({ position }: PositionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: position?.name || "",
    risk_level: position?.risk_level || ("Bajo" as "Bajo" | "Medio" | "Alto"),
    min_salary: position?.min_salary || 0,
    max_salary: position?.max_salary || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate salary range
    if (formData.max_salary < formData.min_salary) {
      setError("El salario máximo debe ser mayor o igual al salario mínimo")
      setLoading(false)
      return
    }

    try {
      const url = position ? `/api/positions/${position.id}` : "/api/positions"
      const method = position ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar puesto")
      }

      router.push("/departments/positions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Puesto *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Analista Senior"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risk_level">Nivel de Riesgo *</Label>
        <Select
          value={formData.risk_level}
          onValueChange={(value: "Bajo" | "Medio" | "Alto") => setFormData({ ...formData, risk_level: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar nivel de riesgo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bajo">Bajo</SelectItem>
            <SelectItem value="Medio">Medio</SelectItem>
            <SelectItem value="Alto">Alto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="min_salary">Salario Mínimo *</Label>
          <Input
            id="min_salary"
            type="number"
            min="0"
            step="0.01"
            value={formData.min_salary}
            onChange={(e) => setFormData({ ...formData, min_salary: Number.parseFloat(e.target.value) || 0 })}
            placeholder="25000.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_salary">Salario Máximo *</Label>
          <Input
            id="max_salary"
            type="number"
            min="0"
            step="0.01"
            value={formData.max_salary}
            onChange={(e) => setFormData({ ...formData, max_salary: Number.parseFloat(e.target.value) || 0 })}
            placeholder="40000.00"
            required
          />
        </div>
      </div>

      {formData.min_salary > 0 && formData.max_salary > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Rango salarial:</strong> ₡{formData.min_salary.toLocaleString()} - ₡
            {formData.max_salary.toLocaleString()}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Diferencia: ₡{(formData.max_salary - formData.min_salary).toLocaleString()}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {position ? "Actualizar" : "Crear"} Puesto
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
