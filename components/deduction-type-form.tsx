"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, X } from "lucide-react"
import type { DeductionType } from "@/lib/database/types"

interface DeductionTypeFormProps {
  deductionType?: DeductionType
}

export default function DeductionTypeForm({ deductionType }: DeductionTypeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: deductionType?.name || "",
    depends_on_salary: deductionType?.depends_on_salary || false,
    description: deductionType?.description || "",
    status: deductionType?.status || ("Activo" as "Activo" | "Inactivo"),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = deductionType ? `/api/deduction-types/${deductionType.id}` : "/api/deduction-types"
      const method = deductionType ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar tipo de deducción")
      }

      router.push("/income-deductions")
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
        <Label htmlFor="name">Nombre del Tipo de Deducción *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Seguro Social"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado *</Label>
        <Select
          value={formData.status}
          onValueChange={(value: "Activo" | "Inactivo") => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="depends_on_salary"
          checked={formData.depends_on_salary}
          onCheckedChange={(checked) => setFormData({ ...formData, depends_on_salary: checked as boolean })}
        />
        <Label
          htmlFor="depends_on_salary"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Depende del salario base
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del tipo de deducción..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {deductionType ? "Actualizar" : "Crear"} Tipo de Deducción
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
