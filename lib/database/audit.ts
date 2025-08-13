import { createClient } from "@/lib/supabase/server"

export interface AuditLog {
  id: number
  user_id: string
  action: string
  table_name: string
  record_id?: number
  old_values?: any
  new_values?: any
  ip_address?: string
  user_agent?: string
  created_at: string
}

export async function createAuditLog(logData: {
  action: string
  table_name: string
  record_id?: number
  old_values?: any
  new_values?: any
  ip_address?: string
  user_agent?: string
}) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      user_id: user.id,
      ...logData,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating audit log: ${error.message}`)
  }

  return data as AuditLog
}

export async function getAuditLogs(filters?: {
  table_name?: string
  action?: string
  start_date?: string
  end_date?: string
  limit?: number
}) {
  const supabase = createClient()

  let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false })

  if (filters?.table_name) {
    query = query.eq("table_name", filters.table_name)
  }

  if (filters?.action) {
    query = query.eq("action", filters.action)
  }

  if (filters?.start_date) {
    query = query.gte("created_at", filters.start_date)
  }

  if (filters?.end_date) {
    query = query.lte("created_at", filters.end_date)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching audit logs: ${error.message}`)
  }

  return data as AuditLog[]
}

export async function getSystemActivity() {
  const supabase = createClient()

  // Get activity summary for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from("audit_logs")
    .select("action, table_name, created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())

  if (error) {
    throw new Error(`Error fetching system activity: ${error.message}`)
  }

  // Process data for dashboard
  const activityByDay: { [key: string]: number } = {}
  const activityByTable: { [key: string]: number } = {}
  const activityByAction: { [key: string]: number } = {}

  data?.forEach((log) => {
    const date = new Date(log.created_at).toISOString().split("T")[0]
    activityByDay[date] = (activityByDay[date] || 0) + 1
    activityByTable[log.table_name] = (activityByTable[log.table_name] || 0) + 1
    activityByAction[log.action] = (activityByAction[log.action] || 0) + 1
  })

  return {
    total_activities: data?.length || 0,
    activity_by_day: activityByDay,
    activity_by_table: activityByTable,
    activity_by_action: activityByAction,
  }
}
