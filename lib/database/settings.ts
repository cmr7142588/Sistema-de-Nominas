import { createClient } from "@/lib/supabase/server"

export interface SystemSetting {
  id: number
  setting_key: string
  setting_value: string
  description?: string
  category: string
  updated_by?: string
  updated_at: string
}

export async function getSystemSettings(category?: string) {
  const supabase = createClient()

  let query = supabase
    .from("system_settings")
    .select("*")
    .order("category", { ascending: true })
    .order("setting_key", { ascending: true })

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching system settings: ${error.message}`)
  }

  return data as SystemSetting[]
}

export async function getSystemSetting(key: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("system_settings").select("*").eq("setting_key", key).single()

  if (error) {
    throw new Error(`Error fetching system setting: ${error.message}`)
  }

  return data as SystemSetting
}

export async function updateSystemSetting(key: string, value: string) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("system_settings")
    .update({
      setting_value: value,
      updated_by: user?.id,
      updated_at: new Date().toISOString(),
    })
    .eq("setting_key", key)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating system setting: ${error.message}`)
  }

  return data as SystemSetting
}

export async function createSystemSetting(settingData: {
  setting_key: string
  setting_value: string
  description?: string
  category: string
}) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("system_settings")
    .insert({
      ...settingData,
      updated_by: user?.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating system setting: ${error.message}`)
  }

  return data as SystemSetting
}
