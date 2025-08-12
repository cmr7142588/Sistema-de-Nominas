import { type NextRequest, NextResponse } from "next/server"
import { getEmployeeReport } from "@/lib/database/reports"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
    }

    const report = await getEmployeeReport(employeeId, startDate || undefined, endDate || undefined)

    if (!report) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error generating employee report:", error)
    return NextResponse.json({ error: "Failed to generate employee report" }, { status: 500 })
  }
}
