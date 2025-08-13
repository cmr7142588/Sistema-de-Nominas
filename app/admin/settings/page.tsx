import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSystemSettings } from "@/lib/database/settings"
import { Settings, Building2, CreditCard, Shield } from "lucide-react"
import SettingsForm from "@/components/settings-form"

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings()

  // Group settings by category
  const settingsByCategory = settings.reduce(
    (acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    },
    {} as Record<string, typeof settings>,
  )

  const categoryIcons = {
    company: Building2,
    payroll: CreditCard,
    security: Shield,
    system: Settings,
    general: Settings,
  }

  const categoryNames = {
    company: "Información de la Empresa",
    payroll: "Configuración de Nómina",
    security: "Seguridad",
    system: "Sistema",
    general: "General",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuraciones del Sistema</h1>
        <p className="text-gray-600">Gestionar configuraciones generales del sistema de nóminas</p>
      </div>

      <div className="space-y-6">
        {Object.entries(settingsByCategory).map(([category, categorySettings]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Settings
          const categoryName = categoryNames[category as keyof typeof categoryNames] || category

          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconComponent className="h-5 w-5 mr-2" />
                  {categoryName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingsForm settings={categorySettings} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
