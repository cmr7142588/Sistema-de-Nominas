"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Save, Loader2 } from "lucide-react"
import type { SystemSetting } from "@/lib/database/settings"

interface SettingsFormProps {
  settings: SystemSetting[]
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<Record<string, string>>(
    settings.reduce(
      (acc, setting) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update each changed setting
      const updates = Object.entries(values).filter(([key, value]) => {
        const originalSetting = settings.find((s) => s.setting_key === key)
        return originalSetting && originalSetting.setting_value !== value
      })

      for (const [key, value] of updates) {
        const response = await fetch(`/api/admin/settings/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        })

        if (!response.ok) {
          throw new Error(`Error updating ${key}`)
        }
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (setting: SystemSetting) => {
    const value = values[setting.setting_key] || ""

    // Special handling for different setting types
    if (setting.setting_key === "payroll_frequency") {
      return (
        <Select value={value} onValueChange={(newValue) => setValues({ ...values, [setting.setting_key]: newValue })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="biweekly">Quincenal</SelectItem>
            <SelectItem value="monthly">Mensual</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    if (setting.setting_key === "backup_frequency") {
      return (
        <Select value={value} onValueChange={(newValue) => setValues({ ...values, [setting.setting_key]: newValue })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diario</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensual</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    if (setting.setting_key.includes("address") || setting.description?.toLowerCase().includes("descripción")) {
      return (
        <Textarea
          value={value}
          onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
          rows={3}
        />
      )
    }

    return (
      <Input
        type={setting.setting_key.includes("timeout") || setting.setting_key.includes("attempts") ? "number" : "text"}
        value={value}
        onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting) => (
          <div key={setting.setting_key} className="space-y-2">
            <Label htmlFor={setting.setting_key}>
              {setting.description || setting.setting_key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Label>
            {renderInput(setting)}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuraciones
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
