import { updateSystemSetting } from "@/lib/database/settings"
import { createAuditLog } from "@/lib/database/audit"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    const { value } = await request.json()
    const settingKey = params.key

    if (!settingKey || !value) {
      return NextResponse.json({ error: "Clave y valor son requeridos" }, { status: 400 })
    }

    // Get old value for audit
    const oldSetting = await updateSystemSetting(settingKey, value)

    // Create audit log
    await createAuditLog({
      action: "UPDATE",
      table_name: "system_settings",
      record_id: oldSetting.id,
      old_values: { setting_value: oldSetting.setting_value },
      new_values: { setting_value: value },
      ip_address: request.ip,
      user_agent: request.headers.get("user-agent") || undefined,
    })

    return NextResponse.json(oldSetting)
  } catch (error) {
    console.error("Error updating system setting:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 },
    )
  }
}
