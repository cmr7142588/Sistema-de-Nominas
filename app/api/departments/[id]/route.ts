import { updateDepartment, deleteDepartment } from "@/lib/database/departments"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const departmentId = Number.parseInt(params.id)

    if (Number.isNaN(departmentId)) {
      return NextResponse.json({ error: "ID de departamento inválido" }, { status: 400 })
    }

    const body = await request.json()
    const department = await updateDepartment(departmentId, body)

    return NextResponse.json(department)
  } catch (error) {
    console.error("Error updating department:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const departmentId = Number.parseInt(params.id)

    if (Number.isNaN(departmentId)) {
      return NextResponse.json({ error: "ID de departamento inválido" }, { status: 400 })
    }

    await deleteDepartment(departmentId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting department:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
