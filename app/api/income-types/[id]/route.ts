import { updateIncomeType, deleteIncomeType } from "@/lib/database/income-deductions"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const incomeTypeId = Number.parseInt(params.id)

    if (Number.isNaN(incomeTypeId)) {
      return NextResponse.json({ error: "ID de tipo de ingreso inválido" }, { status: 400 })
    }

    const body = await request.json()
    const incomeType = await updateIncomeType(incomeTypeId, body)

    return NextResponse.json(incomeType)
  } catch (error) {
    console.error("Error updating income type:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const incomeTypeId = Number.parseInt(params.id)

    if (Number.isNaN(incomeTypeId)) {
      return NextResponse.json({ error: "ID de tipo de ingreso inválido" }, { status: 400 })
    }

    await deleteIncomeType(incomeTypeId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting income type:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
