import { createClient } from "@/lib/supabase/server"

export interface PayrollSummary {
  totalEmployees: number
  totalDepartments: number
  totalPositions: number
  totalTransactions: number
  totalIncome: number
  totalDeductions: number
  netPayroll: number
}

export interface DepartmentReport {
  id: string
  name: string
  location: string
  responsible: string
  employeeCount: number
  totalIncome: number
  totalDeductions: number
  netPayroll: number
  employees: {
    id: string
    name: string
    cedula: string
    position: string
    salary: number
    totalIncome: number
    totalDeductions: number
    netPay: number
  }[]
}

export interface EmployeeReport {
  id: string
  name: string
  cedula: string
  department: string
  position: string
  salary: number
  transactions: {
    id: string
    type: "income" | "deduction"
    typeName: string
    amount: number
    date: string
    status: string
  }[]
  totalIncome: number
  totalDeductions: number
  netPay: number
}

export interface DepartmentAnalytics {
  department_id: string
  department_name: string
  employee_count: number
  total_salary: number
  avg_salary: number
}

export async function getPayrollSummary(startDate?: string, endDate?: string): Promise<PayrollSummary> {
  const supabase = createClient()

  // Get basic counts
  const [employeesResult, departmentsResult, positionsResult] = await Promise.all([
    supabase.from("employees").select("id", { count: "exact" }),
    supabase.from("departments").select("id", { count: "exact" }),
    supabase.from("positions").select("id", { count: "exact" }),
  ])

  // Build transaction query with date filters
  let transactionQuery = supabase.from("transactions").select("type, amount, status").eq("status", "active")

  if (startDate) {
    transactionQuery = transactionQuery.gte("date", startDate)
  }
  if (endDate) {
    transactionQuery = transactionQuery.lte("date", endDate)
  }

  const { data: transactions } = await transactionQuery

  const totalIncome = transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0) || 0
  const totalDeductions = transactions?.filter((t) => t.type === "deduction").reduce((sum, t) => sum + t.amount, 0) || 0

  return {
    totalEmployees: employeesResult.count || 0,
    totalDepartments: departmentsResult.count || 0,
    totalPositions: positionsResult.count || 0,
    totalTransactions: transactions?.length || 0,
    totalIncome,
    totalDeductions,
    netPayroll: totalIncome - totalDeductions,
  }
}

export async function getDepartmentReports(startDate?: string, endDate?: string): Promise<DepartmentReport[]> {
  const supabase = createClient()

  const { data: departments } = await supabase.from("departments").select(`
      id,
      name,
      location,
      responsible,
      employees (
        id,
        name,
        cedula,
        salary,
        positions (
          name
        )
      )
    `)

  if (!departments) return []

  const reports: DepartmentReport[] = []

  for (const dept of departments) {
    const employeeIds = dept.employees.map((e) => e.id)

    // Get transactions for all employees in this department
    let transactionQuery = supabase
      .from("transactions")
      .select(`
        employee_id,
        type,
        amount,
        status
      `)
      .in("employee_id", employeeIds)
      .eq("status", "active")

    if (startDate) {
      transactionQuery = transactionQuery.gte("date", startDate)
    }
    if (endDate) {
      transactionQuery = transactionQuery.lte("date", endDate)
    }

    const { data: transactions } = await transactionQuery

    const employeeReports = dept.employees.map((emp) => {
      const empTransactions = transactions?.filter((t) => t.employee_id === emp.id) || []
      const totalIncome = empTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const totalDeductions = empTransactions
        .filter((t) => t.type === "deduction")
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        id: emp.id,
        name: emp.name,
        cedula: emp.cedula,
        position: emp.positions?.name || "Sin puesto",
        salary: emp.salary,
        totalIncome,
        totalDeductions,
        netPay: totalIncome - totalDeductions,
      }
    })

    const deptTotalIncome = employeeReports.reduce((sum, emp) => sum + emp.totalIncome, 0)
    const deptTotalDeductions = employeeReports.reduce((sum, emp) => sum + emp.totalDeductions, 0)

    reports.push({
      id: dept.id,
      name: dept.name,
      location: dept.location,
      responsible: dept.responsible,
      employeeCount: dept.employees.length,
      totalIncome: deptTotalIncome,
      totalDeductions: deptTotalDeductions,
      netPayroll: deptTotalIncome - deptTotalDeductions,
      employees: employeeReports,
    })
  }

  return reports
}

export async function getEmployeeReport(
  employeeId: string,
  startDate?: string,
  endDate?: string,
): Promise<EmployeeReport | null> {
  const supabase = createClient()

  const { data: employee } = await supabase
    .from("employees")
    .select(`
      id,
      name,
      cedula,
      salary,
      departments (
        name
      ),
      positions (
        name
      )
    `)
    .eq("id", employeeId)
    .single()

  if (!employee) return null

  // Get transactions for this employee
  let transactionQuery = supabase
    .from("transactions")
    .select(`
      id,
      type,
      amount,
      date,
      status,
      income_types (
        name
      ),
      deduction_types (
        name
      )
    `)
    .eq("employee_id", employeeId)
    .eq("status", "active")
    .order("date", { ascending: false })

  if (startDate) {
    transactionQuery = transactionQuery.gte("date", startDate)
  }
  if (endDate) {
    transactionQuery = transactionQuery.lte("date", endDate)
  }

  const { data: transactions } = await transactionQuery

  const transactionReports =
    transactions?.map((t) => ({
      id: t.id,
      type: t.type as "income" | "deduction",
      typeName: t.type === "income" ? t.income_types?.name || "Ingreso" : t.deduction_types?.name || "Deducción",
      amount: t.amount,
      date: t.date,
      status: t.status,
    })) || []

  const totalIncome = transactionReports.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalDeductions = transactionReports.filter((t) => t.type === "deduction").reduce((sum, t) => sum + t.amount, 0)

  return {
    id: employee.id,
    name: employee.name,
    cedula: employee.cedula,
    department: employee.departments?.name || "Sin departamento",
    position: employee.positions?.name || "Sin puesto",
    salary: employee.salary,
    transactions: transactionReports,
    totalIncome,
    totalDeductions,
    netPay: totalIncome - totalDeductions,
  }
}

export async function getTransactionsByPeriod(startDate: string, endDate: string, type?: "income" | "deduction") {
  const supabase = createClient()

  let query = supabase
    .from("transactions")
    .select(`
      date,
      type,
      amount,
      status
    `)
    .gte("date", startDate)
    .lte("date", endDate)
    .eq("status", "active")

  if (type) {
    query = query.eq("type", type)
  }

  const { data: transactions } = await query

  // Group by date
  const groupedData: { [key: string]: { income: number; deduction: number } } = {}

  transactions?.forEach((t) => {
    const date = t.date
    if (!groupedData[date]) {
      groupedData[date] = { income: 0, deduction: 0 }
    }
    groupedData[date][t.type] += t.amount
  })

  return Object.entries(groupedData)
    .map(([date, amounts]) => ({
      date,
      income: amounts.income,
      deduction: amounts.deduction,
      net: amounts.income - amounts.deduction,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function getDepartmentAnalytics(): Promise<DepartmentAnalytics[]> {
  const supabase = createClient()

  const { data: departments } = await supabase.from("departments").select(`
    id,
    name,
    employees (
      id,
      salary
    )
  `)

  if (!departments) return []

  return departments.map((dept) => {
    const employeeCount = dept.employees.length
    const totalSalary = dept.employees.reduce((sum, emp) => sum + emp.salary, 0)
    const avgSalary = employeeCount > 0 ? totalSalary / employeeCount : 0

    return {
      department_id: dept.id,
      department_name: dept.name,
      employee_count: employeeCount,
      total_salary: totalSalary,
      avg_salary: avgSalary,
    }
  })
}
