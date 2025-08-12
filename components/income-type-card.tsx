"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, FileText, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DeleteConfirmationDialog from "./delete-confirmation-dialog"
import { toast } from "@/hooks/use-toast"
import type { IncomeType } from "@/lib/database/types"

interface IncomeTypeCardProps {
  incomeType: IncomeType
}

export default function IncomeTypeCard({ incomeType }: IncomeTypeCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/income-types/${incomeType.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar tipo de ingreso")
      }

      toast({
        title: "Tipo de ingreso eliminado",
        description: `El tipo de ingreso ${incomeType.name} ha sido eliminado exitosamente.`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <>
      <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">{incomeType.name}</CardTitle>
              </div>
            </div>
            <Badge className={getStatusColor(incomeType.status)}>{incomeType.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{incomeType.depends_on_salary ? "Depende del salario" : "Monto fijo"}</span>
          </div>
          {incomeType.description && (
            <div className="flex items-start space-x-2 text-sm">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <span className="text-gray-600 text-xs">{incomeType.description}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t">
            <div className="flex space-x-2">
              <Link href={`/income-deductions/income/${incomeType.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 bg-transparent"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Eliminar Tipo de Ingreso"
        description="¿Estás seguro de que deseas eliminar el tipo de ingreso"
        itemName={incomeType.name}
      />
    </>
  )
}
