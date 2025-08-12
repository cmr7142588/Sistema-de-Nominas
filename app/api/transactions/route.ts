import { createTransaction } from "@/lib/database/transactions"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.employee_id || !body.type_id || !body.transaction_type || !body.amount) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json({ error: "El monto debe ser mayor a cero" }, { status: 400 })
    }

    // Validate transaction type
    if (!["Ingreso", "Deduccion"].includes(body.transaction_type)) {
      return NextResponse.json({ error: "Tipo de transacción inválido" }, { status: 400 })
    }

    // Validate period
    if (body.period_month < 1 || body.period_month > 12) {
      return NextResponse.json({ error: "Mes del período inválido" }, { status: 400 })
    }

    if (body.period_year < 2020 || body.period_year > new Date().getFullYear() + 1) {
      return NextResponse.json({ error: "Año del período inválido" }, { status: 400 })
    }

    const transaction = await createTransaction(body)
    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
