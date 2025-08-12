import { updatePosition, deletePosition } from "@/lib/database/departments"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const positionId = Number.parseInt(params.id)

    if (Number.isNaN(positionId)) {
      return NextResponse.json({ error: "ID de puesto inválido" }, { status: 400 })
    }

    const body = await request.json()

    // Validate salary range if both are provided
    if (body.min_salary && body.max_salary && body.max_salary < body.min_salary) {
      return NextResponse.json({ error: "El salario máximo debe ser mayor o igual al mínimo" }, { status: 400 })
    }

    const position = await updatePosition(positionId, body)
    return NextResponse.json(position)
  } catch (error) {
    console.error("Error updating position:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const positionId = Number.parseInt(params.id)

    if (Number.isNaN(positionId)) {
      return NextResponse.json({ error: "ID de puesto inválido" }, { status: 400 })
    }

    await deletePosition(positionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting position:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
