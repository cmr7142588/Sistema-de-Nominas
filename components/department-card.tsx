"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, User, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DeleteConfirmationDialog from "./delete-confirmation-dialog"
import { toast } from "@/hooks/use-toast"
import type { Department } from "@/lib/database/types"

interface DepartmentCardProps {
  department: Department
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/departments/${department.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar departamento")
      }

      toast({
        title: "Departamento eliminado",
        description: `El departamento ${department.name} ha sido eliminado exitosamente.`,
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

  return (
    <>
      <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">{department.name}</CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {department.physical_location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{department.physical_location}</span>
            </div>
          )}
          {department.area_manager && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{department.area_manager}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t">
            <div className="flex space-x-2">
              <Link href={`/departments/${department.id}/edit`}>
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
        title="Eliminar Departamento"
        description="¿Estás seguro de que deseas eliminar el departamento"
        itemName={department.name}
      />
    </>
  )
}
