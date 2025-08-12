"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Download, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

interface Employee {
  id: string
  name: string
  cedula: string
  department: string
  position: string
  salary: number
}

interface EmployeeReport {
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

export default function EmployeeReportsPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [employeeReport, setEmployeeReport] = useState<EmployeeReport | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    }
  }

  const fetchEmployeeReport = async () => {
    if (!selectedEmployee) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        employeeId: selectedEmployee,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })

      const response = await fetch(`/api/reports/employee?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEmployeeReport(data)
      }
    } catch (error) {
      console.error("Error fetching employee report:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(
    (emp) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.cedula.includes(searchTerm),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/reports">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Reportes
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reportes de Empleados</h1>
        <p className="text-slate-600">Genera reportes detallados de transacciones para empleados específicos.</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-green-900">Filtros de Reporte</CardTitle>
          <CardDescription>Selecciona un empleado y el período para generar el reporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Buscar Empleado</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Nombre o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Empleado</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.cedula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Fecha Inicio</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Fecha Fin</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={fetchEmployeeReport}
              disabled={!selectedEmployee || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Generando..." : "Generar Reporte"}
            </Button>
            {employeeReport && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employee Report */}
      {employeeReport && (
        <div className="space-y-6">
          {/* Employee Info */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Reporte de {employeeReport.name}</CardTitle>
              <CardDescription>
                Cédula: {employeeReport.cedula} • Departamento: {employeeReport.department} • Puesto:{" "}
                {employeeReport.position}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-600">Salario Base</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">${employeeReport.salary.toLocaleString()}</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Total Ingresos</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    ${employeeReport.totalIncome.toLocaleString()}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Total Deducciones</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">
                    ${employeeReport.totalDeductions.toLocaleString()}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Pago Neto</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">${employeeReport.netPay.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historial de Transacciones
              </CardTitle>
              <CardDescription>{employeeReport.transactions.length} transacciones encontradas</CardDescription>
            </CardHeader>
            <CardContent>
              {employeeReport.transactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No se encontraron transacciones para el período seleccionado
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-600">Fecha</th>
                        <th className="text-left py-2 font-medium text-slate-600">Tipo</th>
                        <th className="text-left py-2 font-medium text-slate-600">Concepto</th>
                        <th className="text-right py-2 font-medium text-slate-600">Monto</th>
                        <th className="text-center py-2 font-medium text-slate-600">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeReport.transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-slate-100">
                          <td className="py-3 text-slate-600">{new Date(transaction.date).toLocaleDateString()}</td>
                          <td className="py-3">
                            <Badge
                              variant={transaction.type === "income" ? "default" : "destructive"}
                              className={
                                transaction.type === "income"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {transaction.type === "income" ? "Ingreso" : "Deducción"}
                            </Badge>
                          </td>
                          <td className="py-3 font-medium">{transaction.typeName}</td>
                          <td className="py-3 text-right font-medium">
                            <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <Badge variant="secondary">{transaction.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
