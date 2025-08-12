import { updateDeductionType, deleteDeductionType } from "@/lib/database/income-deductions"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deductionTypeId = Number.parseInt(params.id)

    if (Number.isNaN(deductionTypeId)) {
      return NextResponse.json({ error: "ID de tipo de deducción inválido" }, { status: 400 })
    }

    const body = await request.json()
    const deductionType = await updateDeductionType(deductionTypeId, body)

    return NextResponse.json(deductionType)
  } catch (error) {
    console.error("Error updating deduction type:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deductionTypeId = Number.parseInt(params.id)

    if (Number.isNaN(deductionTypeId)) {
      return NextResponse.json({ error: "ID de tipo de deducción inválido" }, { status: 400 })
    }

    await deleteDeductionType(deductionTypeId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting deduction type:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
