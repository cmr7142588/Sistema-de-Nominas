"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Building2, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DeleteConfirmationDialog from "./delete-confirmation-dialog"
import { toast } from "@/hooks/use-toast"
import type { Transaction } from "@/lib/database/types"

interface TransactionCardProps {
  transaction: Transaction
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar transacción")
      }

      toast({
        title: "Transacción eliminada",
        description: "La transacción ha sido eliminada exitosamente.",
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

  const getTransactionTypeColor = (type: string) => {
    return type === "Ingreso" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-blue-100 text-blue-800"
      case "Procesado":
        return "bg-green-100 text-green-800"
      case "Anulado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const typeName =
    transaction.transaction_type === "Ingreso" ? transaction.income_type?.name : transaction.deduction_type?.name

  return (
    <>
      <Card
        className={`bg-white shadow-lg border-0 hover:shadow-xl transition-shadow border-l-4 ${
          transaction.transaction_type === "Ingreso" ? "border-l-green-500" : "border-l-red-500"
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className={`p-2 rounded-lg ${
                    transaction.transaction_type === "Ingreso" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {transaction.transaction_type === "Ingreso" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{typeName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getTransactionTypeColor(transaction.transaction_type)}>
                      {transaction.transaction_type}
                    </Badge>
                    <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{transaction.employee?.name}</p>
                    <p className="text-xs">{transaction.employee?.cedula}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>{transaction.employee?.department?.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <p>{new Date(transaction.transaction_date).toLocaleDateString()}</p>
                    <p className="text-xs">
                      Período: {transaction.period_month}/{transaction.period_year}
                    </p>
                  </div>
                </div>
              </div>

              {transaction.description && (
                <p className="text-sm text-gray-600 mt-3 italic">{transaction.description}</p>
              )}
            </div>

            <div className="text-right ml-6">
              <p
                className={`text-2xl font-bold ${
                  transaction.transaction_type === "Ingreso" ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.transaction_type === "Ingreso" ? "+" : "-"}₡{Number(transaction.amount).toLocaleString()}
              </p>
              <div className="flex space-x-2 mt-3">
                <Link href={`/transactions/${transaction.id}/edit`}>
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
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Eliminar Transacción"
        description="¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer."
        itemName={`${transaction.transaction_type} - ${typeName}`}
      />
    </>
  )
}
