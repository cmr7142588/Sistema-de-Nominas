import { createClient } from "@/lib/supabase/server"
import type { Employee, CreateEmployeeData, Transaction } from "./types"

export async function getEmployees(filters?: {
  department_id?: number
  position_id?: number
  status?: string
  search?: string
}) {
  const supabase = createClient()

  let query = supabase
    .from("employees")
    .select(`
      *,
      department:departments(*),
      position:positions(*)
    `)
    .order("name")

  if (filters?.department_id) {
    query = query.eq("department_id", filters.department_id)
  }

  if (filters?.position_id) {
    query = query.eq("position_id", filters.position_id)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,cedula.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching employees: ${error.message}`)
  }

  return data as Employee[]
}

export async function getEmployeeById(id: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:departments(*),
      position:positions(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Error fetching employee: ${error.message}`)
  }

  return data as Employee
}

export async function createEmployee(employeeData: CreateEmployeeData) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("employees")
    .insert(employeeData)
    .select(`
      *,
      department:departments(*),
      position:positions(*)
    `)
    .single()

  if (error) {
    throw new Error(`Error creating employee: ${error.message}`)
  }

  return data as Employee
}

export async function updateEmployee(id: number, employeeData: Partial<CreateEmployeeData>) {
  const supabase = createClient()

  const { data, error } = await supabase.from("employees").update(employeeData).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error updating employee: ${error.message}`)
  }

  return data as Employee
}

export async function deleteEmployee(id: number) {
  const supabase = createClient()

  const { error } = await supabase.from("employees").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting employee: ${error.message}`)
  }
}

export async function getEmployeeTransactions(
  employeeId: number,
  filters?: {
    startDate?: string
    endDate?: string
    transactionType?: "Ingreso" | "Deduccion"
    periodMonth?: number
    periodYear?: number
  },
) {
  const supabase = createClient()

  // First get transactions without joins
  let query = supabase
    .from("transactions")
    .select("*")
    .eq("employee_id", employeeId)
    .order("transaction_date", { ascending: false })

  if (filters?.startDate) {
    query = query.gte("transaction_date", filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte("transaction_date", filters.endDate)
  }

  if (filters?.transactionType) {
    query = query.eq("transaction_type", filters.transactionType)
  }

  if (filters?.periodMonth) {
    query = query.eq("period_month", filters.periodMonth)
  }

  if (filters?.periodYear) {
    query = query.eq("period_year", filters.periodYear)
  }

  const { data: transactions, error } = await query

  if (error) {
    throw new Error(`Error fetching employee transactions: ${error.message}`)
  }

  if (!transactions || transactions.length === 0) {
    return []
  }

  // Get income types and deduction types separately
  const { data: incomeTypes } = await supabase.from("income_types").select("*")
  const { data: deductionTypes } = await supabase.from("deduction_types").select("*")

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
      type_info: typeInfo,
    }
  })

  return enrichedTransactions as Transaction[]
}

export async function getDepartments() {
  const supabase = createClient()

  const { data, error } = await supabase.from("departments").select("*").order("name")

  if (error) {
    throw new Error(`Error fetching departments: ${error.message}`)
  }

  return data
}

export async function getPositions() {
  const supabase = createClient()

  const { data, error } = await supabase.from("positions").select("*").order("name")

  if (error) {
    throw new Error(`Error fetching positions: ${error.message}`)
  }

  return data
}
