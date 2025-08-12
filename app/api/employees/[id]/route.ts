import { updateEmployee } from "@/lib/database/employees"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const employeeId = Number.parseInt(params.id)

    if (Number.isNaN(employeeId)) {
      return NextResponse.json({ error: "ID de empleado inválido" }, { status: 400 })
    }

    const body = await request.json()
    const employee = await updateEmployee(employeeId, body)

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
