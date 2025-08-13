import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPayrollSummary, getDepartmentAnalytics } from "@/lib/database/reports"
import { AnalyticsCharts } from "@/components/analytics-charts"
import Link from "next/link"

async function AnalyticsData() {
  const [summary, departmentAnalytics] = await Promise.all([getPayrollSummary(), getDepartmentAnalytics()])

  return <AnalyticsCharts summary={summary} departmentAnalytics={departmentAnalytics} />
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Análisis y Estadísticas</h1>
              <p className="text-slate-600">Dashboard completo de métricas y tendencias del sistema de nóminas</p>
            </div>
            <Link href="/">
              <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
                ← Volver al inicio
              </Badge>
            </Link>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="space-y-0 pb-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }
        >
          <AnalyticsData />
        </Suspense>
      </div>
    </div>
  )
}
