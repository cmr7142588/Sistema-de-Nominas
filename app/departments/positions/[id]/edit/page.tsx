import { getPositionById } from "@/lib/database/departments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import PositionForm from "@/components/position-form"

interface PageProps {
  params: { id: string }
}

export default async function EditPositionPage({ params }: PageProps) {
  const positionId = Number.parseInt(params.id)

  if (Number.isNaN(positionId)) {
    notFound()
  }

  try {
    const position = await getPositionById(positionId)

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/departments/positions" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Puesto</h1>
              <p className="text-gray-600">Modificar información de {position.name}</p>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-white shadow-lg border-0 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Información del Puesto</CardTitle>
            </CardHeader>
            <CardContent>
              <PositionForm position={position} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
