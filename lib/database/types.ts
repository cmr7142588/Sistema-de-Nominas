// Tipos TypeScript para el sistema de nóminas

export interface Department {
  id: number
  name: string
  physical_location?: string
  area_manager?: string
  created_at: string
  updated_at: string
}

export interface Position {
  id: number
  name: string
  risk_level: "Bajo" | "Medio" | "Alto"
  min_salary: number
  max_salary: number
  created_at: string
  updated_at: string
}

export interface Employee {
  id: number
  cedula: string
  name: string
  department_id: number
  position_id: number
  monthly_salary: number
  payroll_id?: string
  hire_date: string
  status: "Activo" | "Inactivo" | "Suspendido"
  created_at: string
  updated_at: string
  // Relaciones
  department?: Department
  position?: Position
}

export interface IncomeType {
  id: number
  name: string
  depends_on_salary: boolean
  status: "Activo" | "Inactivo"
  description?: string
  created_at: string
  updated_at: string
}

export interface DeductionType {
  id: number
  name: string
  depends_on_salary: boolean
  status: "Activo" | "Inactivo"
  description?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: number
  employee_id: number
  type_id: number
  transaction_type: "Ingreso" | "Deduccion"
  amount: number
  transaction_date: string
  period_month: number
  period_year: number
  status: "Activo" | "Anulado" | "Procesado"
  description?: string
  created_at: string
  updated_at: string
  // Relaciones
  employee?: Employee
  income_type?: IncomeType
  deduction_type?: DeductionType
}

// Tipos para formularios
export interface CreateEmployeeData {
  cedula: string
  name: string
  department_id: number
  position_id: number
  monthly_salary: number
  payroll_id?: string
  hire_date?: string
}

export interface CreateTransactionData {
  employee_id: number
  type_id: number
  transaction_type: "Ingreso" | "Deduccion"
  amount: number
  transaction_date?: string
  period_month: number
  period_year: number
  description?: string
}

// Tipos para reportes
export interface PayrollSummary {
  department_name: string
  employee_count: number
  total_salaries: number
  total_incomes: number
  total_deductions: number
  net_payroll: number
}

export interface EmployeePayrollDetail {
  employee: Employee
  base_salary: number
  incomes: Transaction[]
  deductions: Transaction[]
  total_incomes: number
  total_deductions: number
  net_salary: number
}
