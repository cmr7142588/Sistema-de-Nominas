-- Datos iniciales para el sistema de nóminas

-- Insertar departamentos de ejemplo
INSERT INTO departments (name, physical_location, area_manager) VALUES
('Recursos Humanos', 'Edificio Principal - Piso 2', 'María González'),
('Tecnología', 'Edificio Principal - Piso 3', 'Carlos Rodríguez'),
('Contabilidad', 'Edificio Principal - Piso 1', 'Ana Martínez'),
('Ventas', 'Edificio Comercial - Piso 1', 'Luis Pérez'),
('Operaciones', 'Planta Industrial', 'Roberto Silva')
ON CONFLICT (name) DO NOTHING;

-- Insertar puestos de ejemplo
INSERT INTO positions (name, risk_level, min_salary, max_salary) VALUES
('Gerente General', 'Bajo', 80000.00, 120000.00),
('Gerente de Área', 'Bajo', 60000.00, 90000.00),
('Supervisor', 'Medio', 40000.00, 60000.00),
('Analista Senior', 'Bajo', 35000.00, 55000.00),
('Analista Junior', 'Bajo', 25000.00, 40000.00),
('Técnico', 'Medio', 20000.00, 35000.00),
('Operario', 'Alto', 18000.00, 30000.00),
('Asistente Administrativo', 'Bajo', 15000.00, 25000.00)
ON CONFLICT (name) DO NOTHING;

-- Insertar tipos de ingresos comunes
INSERT INTO income_types (name, depends_on_salary, description) VALUES
('Salario Base', true, 'Salario mensual base del empleado'),
('Horas Extra', false, 'Pago por horas trabajadas adicionales'),
('Bonificación por Desempeño', false, 'Bonificación basada en evaluación de desempeño'),
('Aguinaldo', true, 'Décimo tercer mes'),
('Vacaciones', true, 'Pago por período vacacional'),
('Comisiones', false, 'Comisiones por ventas o metas alcanzadas'),
('Subsidio de Transporte', false, 'Ayuda para transporte'),
('Subsidio de Alimentación', false, 'Ayuda para alimentación')
ON CONFLICT (name) DO NOTHING;

-- Insertar tipos de deducciones comunes
INSERT INTO deduction_types (name, depends_on_salary, description) VALUES
('Seguro Social', true, 'Deducción obligatoria para seguro social'),
('Impuesto sobre la Renta', true, 'Deducción de impuesto sobre la renta'),
('Seguro de Vida', false, 'Prima de seguro de vida'),
('Préstamo Personal', false, 'Descuento por préstamo personal'),
('Fondo de Pensiones', true, 'Aporte a fondo de pensiones'),
('Seguro Médico', false, 'Prima de seguro médico privado'),
('Ausencias', false, 'Descuento por ausencias no justificadas'),
('Adelanto de Salario', false, 'Descuento por adelanto de salario')
ON CONFLICT (name) DO NOTHING;
