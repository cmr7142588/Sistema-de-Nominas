-- Sistema de Nóminas - Esquema de Base de Datos
-- Crear tablas en orden de dependencias

-- 1. Tabla de Departamentos
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    physical_location VARCHAR(200),
    area_manager VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Puestos
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    risk_level VARCHAR(50) CHECK (risk_level IN ('Bajo', 'Medio', 'Alto')),
    min_salary DECIMAL(10,2) NOT NULL CHECK (min_salary >= 0),
    max_salary DECIMAL(10,2) NOT NULL CHECK (max_salary >= min_salary),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Empleados
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    position_id INTEGER NOT NULL REFERENCES positions(id) ON DELETE RESTRICT,
    monthly_salary DECIMAL(10,2) NOT NULL CHECK (monthly_salary >= 0),
    payroll_id VARCHAR(50),
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo', 'Suspendido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Tipos de Ingresos
CREATE TABLE IF NOT EXISTS income_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    depends_on_salary BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Tipos de Deducciones
CREATE TABLE IF NOT EXISTS deduction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    depends_on_salary BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de Transacciones (Registro de Ingresos y Deducciones)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    type_id INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Ingreso', 'Deduccion')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    period_month INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year INTEGER NOT NULL CHECK (period_year >= 2020),
    status VARCHAR(20) DEFAULT 'Activo' CHECK (status IN ('Activo', 'Anulado', 'Procesado')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position_id);
CREATE INDEX IF NOT EXISTS idx_employees_cedula ON employees(cedula);
CREATE INDEX IF NOT EXISTS idx_transactions_employee ON transactions(employee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_period ON transactions(period_year, period_month);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type, type_id);

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_types_updated_at BEFORE UPDATE ON income_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deduction_types_updated_at BEFORE UPDATE ON deduction_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
