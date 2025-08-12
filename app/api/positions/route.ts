import { createPosition } from "@/lib/database/departments"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.risk_level || !body.min_salary || !body.max_salary) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validate salary range
    if (body.max_salary < body.min_salary) {
      return NextResponse.json({ error: "El salario máximo debe ser mayor o igual al mínimo" }, { status: 400 })
    }

    const position = await createPosition(body)
    return NextResponse.json(position)
  } catch (error) {
    console.error("Error creating position:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
