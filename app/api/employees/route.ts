import { createEmployee, getEmployees } from "@/lib/database/employees"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const employees = await getEmployees()
    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.cedula || !body.name || !body.department_id || !body.position_id || !body.monthly_salary) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const employee = await createEmployee(body)
    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
