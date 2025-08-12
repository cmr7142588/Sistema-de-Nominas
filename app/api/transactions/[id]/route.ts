import { updateTransaction, deleteTransaction } from "@/lib/database/transactions"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = Number.parseInt(params.id)

    if (Number.isNaN(transactionId)) {
      return NextResponse.json({ error: "ID de transacción inválido" }, { status: 400 })
    }

    const body = await request.json()

    // Validate amount if provided
    if (body.amount !== undefined && body.amount <= 0) {
      return NextResponse.json({ error: "El monto debe ser mayor a cero" }, { status: 400 })
    }

    // Validate transaction type if provided
    if (body.transaction_type && !["Ingreso", "Deduccion"].includes(body.transaction_type)) {
      return NextResponse.json({ error: "Tipo de transacción inválido" }, { status: 400 })
    }

    // Validate period if provided
    if (body.period_month !== undefined && (body.period_month < 1 || body.period_month > 12)) {
      return NextResponse.json({ error: "Mes del período inválido" }, { status: 400 })
    }

    if (
      body.period_year !== undefined &&
      (body.period_year < 2020 || body.period_year > new Date().getFullYear() + 1)
    ) {
      return NextResponse.json({ error: "Año del período inválido" }, { status: 400 })
    }

    const transaction = await updateTransaction(transactionId, body)
    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = Number.parseInt(params.id)

    if (Number.isNaN(transactionId)) {
      return NextResponse.json({ error: "ID de transacción inválido" }, { status: 400 })
    }

    await deleteTransaction(transactionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
