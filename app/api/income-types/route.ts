import { createIncomeType } from "@/lib/database/income-deductions"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "El nombre del tipo de ingreso es requerido" }, { status: 400 })
    }

    const incomeType = await createIncomeType(body)
    return NextResponse.json(incomeType)
  } catch (error) {
    console.error("Error creating income type:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
