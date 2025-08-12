"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, DollarSign, FileText, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DeleteConfirmationDialog from "./delete-confirmation-dialog"
import { toast } from "@/hooks/use-toast"
import type { DeductionType } from "@/lib/database/types"

interface DeductionTypeCardProps {
  deductionType: DeductionType
}

export default function DeductionTypeCard({ deductionType }: DeductionTypeCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/deduction-types/${deductionType.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar tipo de deducción")
      }

      toast({
        title: "Tipo de deducción eliminado",
        description: `El tipo de deducción ${deductionType.name} ha sido eliminado exitosamente.`,
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
      <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">{deductionType.name}</CardTitle>
              </div>
            </div>
            <Badge className={getStatusColor(deductionType.status)}>{deductionType.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">
              {deductionType.depends_on_salary ? "Depende del salario" : "Monto fijo"}
            </span>
          </div>
          {deductionType.description && (
            <div className="flex items-start space-x-2 text-sm">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <span className="text-gray-600 text-xs">{deductionType.description}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t">
            <div className="flex space-x-2">
              <Link href={`/income-deductions/deduction/${deductionType.id}/edit`}>
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
        title="Eliminar Tipo de Deducción"
        description="¿Estás seguro de que deseas eliminar el tipo de deducción"
        itemName={deductionType.name}
      />
    </>
  )
}
