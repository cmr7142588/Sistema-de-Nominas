"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, X } from "lucide-react"
import type { Department } from "@/lib/database/types"

interface DepartmentFormProps {
  department?: Department
}

export default function DepartmentForm({ department }: DepartmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: department?.name || "",
    physical_location: department?.physical_location || "",
    area_manager: department?.area_manager || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = department ? `/api/departments/${department.id}` : "/api/departments"
      const method = department ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar departamento")
      }

      router.push("/departments")
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
        <Label htmlFor="name">Nombre del Departamento *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Recursos Humanos"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="physical_location">Ubicación Física</Label>
        <Input
          id="physical_location"
          value={formData.physical_location}
          onChange={(e) => setFormData({ ...formData, physical_location: e.target.value })}
          placeholder="Edificio Principal - Piso 2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area_manager">Responsable de Área</Label>
        <Input
          id="area_manager"
          value={formData.area_manager}
          onChange={(e) => setFormData({ ...formData, area_manager: e.target.value })}
          placeholder="María González"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {department ? "Actualizar" : "Crear"} Departamento
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
