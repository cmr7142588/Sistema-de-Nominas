// Script to create admin user using Supabase Auth API
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  try {
    console.log("Creating admin user...")

    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@nominas.com",
      password: "Admin123!",
      email_confirm: true,
      user_metadata: {
        role: "admin",
        name: "Administrador del Sistema",
      },
    })

    if (error) {
      console.error("Error creating user:", error.message)
      return
    }

    console.log("Admin user created successfully!")
    console.log("Email: admin@nominas.com")
    console.log("Password: Admin123!")
    console.log("User ID:", data.user.id)
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

createAdminUser()
