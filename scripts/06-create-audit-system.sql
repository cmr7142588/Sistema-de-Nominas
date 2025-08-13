-- Create audit log table for system activity tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, category) VALUES
('company_name', 'Sistema de Nóminas', 'Nombre de la empresa', 'company'),
('company_address', 'República Dominicana', 'Dirección de la empresa', 'company'),
('company_phone', '+1-809-000-0000', 'Teléfono de la empresa', 'company'),
('payroll_frequency', 'monthly', 'Frecuencia de nómina (weekly, biweekly, monthly)', 'payroll'),
('currency_symbol', '₡', 'Símbolo de moneda', 'payroll'),
('backup_frequency', 'daily', 'Frecuencia de respaldo automático', 'system'),
('max_login_attempts', '5', 'Máximo intentos de login', 'security'),
('session_timeout', '480', 'Tiempo de sesión en minutos', 'security')
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- Enable RLS (Row Level Security)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for audit_logs (only authenticated users can read)
CREATE POLICY "Users can view audit logs" ON audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for system_settings (only authenticated users can read/write)
CREATE POLICY "Users can view system settings" ON system_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update system settings" ON system_settings
  FOR UPDATE USING (auth.role() = 'authenticated');
