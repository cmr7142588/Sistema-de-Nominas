import { createDeductionType } from "@/lib/database/income-deductions"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "El nombre del tipo de deducción es requerido" }, { status: 400 })
    }

    const deductionType = await createDeductionType(body)
    return NextResponse.json(deductionType)
  } catch (error) {
    console.error("Error creating deduction type:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
