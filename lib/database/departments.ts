import { createClient } from "@/lib/supabase/server"
import type { Department, Position } from "./types"

// Department functions
export async function getDepartments() {
  const supabase = createClient()

  const { data, error } = await supabase.from("departments").select("*").order("name")

  if (error) {
    throw new Error(`Error fetching departments: ${error.message}`)
  }

  return data as Department[]
}

export async function getDepartmentById(id: number) {
  const supabase = createClient()

  const { data, error } = await supabase.from("departments").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error fetching department: ${error.message}`)
  }

  return data as Department
}

export async function createDepartment(departmentData: {
  name: string
  physical_location?: string
  area_manager?: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase.from("departments").insert(departmentData).select().single()

  if (error) {
    throw new Error(`Error creating department: ${error.message}`)
  }

  return data as Department
}

export async function updateDepartment(
  id: number,
  departmentData: {
    name?: string
    physical_location?: string
    area_manager?: string
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase.from("departments").update(departmentData).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error updating department: ${error.message}`)
  }

  return data as Department
}

export async function deleteDepartment(id: number) {
  const supabase = createClient()

  // Check if department has employees
  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("id")
    .eq("department_id", id)
    .limit(1)

  if (employeesError) {
    throw new Error(`Error checking department employees: ${employeesError.message}`)
  }

  if (employees && employees.length > 0) {
    throw new Error("No se puede eliminar el departamento porque tiene empleados asignados")
  }

  const { error } = await supabase.from("departments").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting department: ${error.message}`)
  }
}

export async function getDepartmentEmployeeCount(departmentId: number) {
  const supabase = createClient()

  const { count, error } = await supabase
    .from("employees")
    .select("id", { count: "exact" })
    .eq("department_id", departmentId)

  if (error) {
    throw new Error(`Error counting department employees: ${error.message}`)
  }

  return count || 0
}

export async function getDepartmentEmployees(departmentId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      name,
      cedula,
      salary,
      position:positions(name)
    `)
    .eq("department_id", departmentId)
    .order("name")

  if (error) {
    throw new Error(`Error fetching department employees: ${error.message}`)
  }

  return data.map((emp) => ({
    ...emp,
    position: emp.position?.name || "Sin puesto",
  }))
}

// Position functions
export async function getPositions() {
  const supabase = createClient()

  const { data, error } = await supabase.from("positions").select("*").order("name")

  if (error) {
    throw new Error(`Error fetching positions: ${error.message}`)
  }

  return data as Position[]
}

export async function getPositionById(id: number) {
  const supabase = createClient()

  const { data, error } = await supabase.from("positions").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error fetching position: ${error.message}`)
  }

  return data as Position
}

export async function createPosition(positionData: {
  name: string
  risk_level: "Bajo" | "Medio" | "Alto"
  min_salary: number
  max_salary: number
}) {
  const supabase = createClient()

  const { data, error } = await supabase.from("positions").insert(positionData).select().single()

  if (error) {
    throw new Error(`Error creating position: ${error.message}`)
  }

  return data as Position
}

export async function updatePosition(
  id: number,
  positionData: {
    name?: string
    risk_level?: "Bajo" | "Medio" | "Alto"
    min_salary?: number
    max_salary?: number
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase.from("positions").update(positionData).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error updating position: ${error.message}`)
  }

  return data as Position
}

export async function deletePosition(id: number) {
  const supabase = createClient()

  // Check if position has employees
  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("id")
    .eq("position_id", id)
    .limit(1)

  if (employeesError) {
    throw new Error(`Error checking position employees: ${employeesError.message}`)
  }

  if (employees && employees.length > 0) {
    throw new Error("No se puede eliminar el puesto porque tiene empleados asignados")
  }

  const { error } = await supabase.from("positions").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting position: ${error.message}`)
  }
}

export async function getPositionEmployeeCount(positionId: number) {
  const supabase = createClient()

  const { count, error } = await supabase
    .from("employees")
    .select("id", { count: "exact" })
    .eq("position_id", positionId)

  if (error) {
    throw new Error(`Error counting position employees: ${error.message}`)
  }

  return count || 0
}

export async function getPositionEmployees(positionId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      name,
      cedula,
      salary,
      department:departments(name)
    `)
    .eq("position_id", positionId)
    .order("name")

  if (error) {
    throw new Error(`Error fetching position employees: ${error.message}`)
  }

  return data.map((emp) => ({
    ...emp,
    department: emp.department?.name || "Sin departamento",
  }))
}
