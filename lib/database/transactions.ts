import { createClient } from "@/lib/supabase/server"
import type { Transaction, CreateTransactionData } from "./types"

export async function getTransactions(filters?: {
  employee_id?: number
  transaction_type?: "Ingreso" | "Deduccion"
  period_month?: number
  period_year?: number
  start_date?: string
  end_date?: string
  status?: string
  department_id?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from("transactions")
    .select(`
      *,
      employee:employees!inner(
        id,
        name,
        cedula,
        department:departments(id, name),
        position:positions(id, name)
      )
    `)
    .order("transaction_date", { ascending: false })

  if (filters?.employee_id) {
    query = query.eq("employee_id", filters.employee_id)
  }

  if (filters?.transaction_type) {
    query = query.eq("transaction_type", filters.transaction_type)
  }

  if (filters?.period_month) {
    query = query.eq("period_month", filters.period_month)
  }

  if (filters?.period_year) {
    query = query.eq("period_year", filters.period_year)
  }

  if (filters?.start_date) {
    query = query.gte("transaction_date", filters.start_date)
  }

  if (filters?.end_date) {
    query = query.lte("transaction_date", filters.end_date)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.department_id) {
    query = query.eq("employee.department_id", filters.department_id)
  }

  const { data: transactions, error } = await query

  if (error) {
    throw new Error(`Error fetching transactions: ${error.message}`)
  }

  if (!transactions || transactions.length === 0) {
    return []
  }

  // Get income and deduction types separately
  const { data: incomeTypes } = await supabase.from("income_types").select("id, name, depends_on_salary")

  const { data: deductionTypes } = await supabase.from("deduction_types").select("id, name, depends_on_salary")

  // Combine the data
  const enrichedTransactions = transactions.map((transaction) => {
    let typeInfo = null

    if (transaction.transaction_type === "Ingreso") {
      typeInfo = incomeTypes?.find((type) => type.id === transaction.type_id)
    } else if (transaction.transaction_type === "Deduccion") {
      typeInfo = deductionTypes?.find((type) => type.id === transaction.type_id)
    }

    return {
      ...transaction,
      income_type: transaction.transaction_type === "Ingreso" ? typeInfo : null,
      deduction_type: transaction.transaction_type === "Deduccion" ? typeInfo : null,
    }
  })

  return enrichedTransactions as Transaction[]
}

export async function getTransactionById(id: number) {
  const supabase = createClient()

  const { data: transaction, error } = await supabase
    .from("transactions")
    .select(`
      *,
      employee:employees(
        id,
        name,
        cedula,
        department:departments(id, name),
        position:positions(id, name)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching transaction: ${error.message}`)
  }

  // Get the appropriate type information
  let typeInfo = null

  if (transaction.transaction_type === "Ingreso") {
    const { data: incomeType } = await supabase
      .from("income_types")
      .select("id, name, depends_on_salary")
      .eq("id", transaction.type_id)
      .single()
    typeInfo = incomeType
  } else if (transaction.transaction_type === "Deduccion") {
    const { data: deductionType } = await supabase
      .from("deduction_types")
      .select("id, name, depends_on_salary")
      .eq("id", transaction.type_id)
      .single()
    typeInfo = deductionType
  }

  return {
    ...transaction,
    income_type: transaction.transaction_type === "Ingreso" ? typeInfo : null,
    deduction_type: transaction.transaction_type === "Deduccion" ? typeInfo : null,
  } as Transaction
}

export async function createTransaction(transactionData: CreateTransactionData) {
  const supabase = createClient()

  const { data, error } = await supabase.from("transactions").insert(transactionData).select().single()

  if (error) {
    throw new Error(`Error creating transaction: ${error.message}`)
  }

  return data as Transaction
}

export async function updateTransaction(id: number, transactionData: Partial<CreateTransactionData>) {
  const supabase = createClient()

  const { data, error } = await supabase.from("transactions").update(transactionData).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error updating transaction: ${error.message}`)
  }

  return data as Transaction
}

export async function deleteTransaction(id: number) {
  const supabase = createClient()

  const { error } = await supabase.from("transactions").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting transaction: ${error.message}`)
  }
}

export async function getTransactionSummary(filters?: {
  period_month?: number
  period_year?: number
  department_id?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from("transactions")
    .select(`
      transaction_type,
      amount,
      employee:employees!inner(
        department:departments(id, name)
      )
    `)
    .eq("status", "Activo")

  if (filters?.period_month) {
    query = query.eq("period_month", filters.period_month)
  }

  if (filters?.period_year) {
    query = query.eq("period_year", filters.period_year)
  }

  if (filters?.department_id) {
    query = query.eq("employee.department_id", filters.department_id)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching transaction summary: ${error.message}`)
  }

  const summary = {
    total_incomes: 0,
    total_deductions: 0,
    net_amount: 0,
    income_count: 0,
    deduction_count: 0,
  }

  data?.forEach((transaction) => {
    const amount = Number(transaction.amount)
    if (transaction.transaction_type === "Ingreso") {
      summary.total_incomes += amount
      summary.income_count++
    } else {
      summary.total_deductions += amount
      summary.deduction_count++
    }
  })

  summary.net_amount = summary.total_incomes - summary.total_deductions

  return summary
}

export async function getEmployeeTransactionSummary(employeeId: number, periodMonth: number, periodYear: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("transactions")
    .select("transaction_type, amount")
    .eq("employee_id", employeeId)
    .eq("period_month", periodMonth)
    .eq("period_year", periodYear)
    .eq("status", "Activo")

  if (error) {
    throw new Error(`Error fetching employee transaction summary: ${error.message}`)
  }

  const summary = {
    total_incomes: 0,
    total_deductions: 0,
    net_amount: 0,
  }

  data?.forEach((transaction) => {
    const amount = Number(transaction.amount)
    if (transaction.transaction_type === "Ingreso") {
      summary.total_incomes += amount
    } else {
      summary.total_deductions += amount
    }
  })

  summary.net_amount = summary.total_incomes - summary.total_deductions

  return summary
}
