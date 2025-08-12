import { createDepartment } from "@/lib/database/departments"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "El nombre del departamento es requerido" }, { status: 400 })
    }

    const department = await createDepartment(body)
    return NextResponse.json(department)
  } catch (error) {
    console.error("Error creating department:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
