import { createClient } from "@/lib/supabase/server"
import type { IncomeType, DeductionType } from "./types"

// Income Types functions
export async function getIncomeTypes(activeOnly = false) {
  const supabase = createClient()

  let query = supabase.from("income_types").select("*").order("name")

  if (activeOnly) {
    query = query.eq("status", "Activo")
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching income types: ${error.message}`)
  }

  return data as IncomeType[]
}

export async function getIncomeTypeById(id: number) {
  const supabase = createClient()

  const { data, error } = await supabase.from("income_types").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error fetching income type: ${error.message}`)
  }

  return data as IncomeType
}

export async function createIncomeType(incomeTypeData: {
  name: string
  depends_on_salary: boolean
  description?: string
  status?: "Activo" | "Inactivo"
}) {
  const supabase = createClient()

  const { data, error } = await supabase.from("income_types").insert(incomeTypeData).select().single()

  if (error) {
    throw new Error(`Error creating income type: ${error.message}`)
  }

  return data as IncomeType
}

export async function updateIncomeType(
  id: number,
  incomeTypeData: {
    name?: string
    depends_on_salary?: boolean
    description?: string
    status?: "Activo" | "Inactivo"
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase.from("income_types").update(incomeTypeData).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error updating income type: ${error.message}`)
  }

  return data as IncomeType
}

export async function deleteIncomeType(id: number) {
  const supabase = createClient()

  // Check if income type has transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("id")
    .eq("type_id", id)
    .eq("transaction_type", "Ingreso")
    .limit(1)

  if (transactionsError) {
    throw new Error(`Error checking income type transactions: ${transactionsError.message}`)
  }

  if (transactions && transactions.length > 0) {
    throw new Error("No se puede eliminar el tipo de ingreso porque tiene transacciones asociadas")
  }

  const { error } = await supabase.from("income_types").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting income type: ${error.message}`)
  }
}

// Deduction Types functions
export async function getDeductionTypes(activeOnly = false) {
  const supabase = createClient()

  let query = supabase.from("deduction_types").select("*").order("name")

  if (activeOnly) {
    query = query.eq("status", "Activo")
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching deduction types: ${error.message}`)
  }

  return data as DeductionType[]
}

export async function getDeductionTypeById(id: number) {
  const supabase = createClient()

  const { data, error } = await supabase.from("deduction_types").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error fetching deduction type: ${error.message}`)
  }

  return data as DeductionType
}

export async function createDeductionType(deductionTypeData: {
  name: string
  depends_on_salary: boolean
  description?: string
  status?: "Activo" | "Inactivo"
}) {
  const supabase = createClient()

  const { data, error } = await supabase.from("deduction_types").insert(deductionTypeData).select().single()

  if (error) {
    throw new Error(`Error creating deduction type: ${error.message}`)
  }

  return data as DeductionType
}

export async function updateDeductionType(
  id: number,
  deductionTypeData: {
    name?: string
    depends_on_salary?: boolean
    description?: string
    status?: "Activo" | "Inactivo"
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("deduction_types")
    .update(deductionTypeData)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating deduction type: ${error.message}`)
  }

  return data as DeductionType
}

export async function deleteDeductionType(id: number) {
  const supabase = createClient()

  // Check if deduction type has transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("id")
    .eq("type_id", id)
    .eq("transaction_type", "Deduccion")
    .limit(1)

  if (transactionsError) {
    throw new Error(`Error checking deduction type transactions: ${transactionsError.message}`)
  }

  if (transactions && transactions.length > 0) {
    throw new Error("No se puede eliminar el tipo de deducción porque tiene transacciones asociadas")
  }

  const { error } = await supabase.from("deduction_types").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting deduction type: ${error.message}`)
  }
}
