-- Confirmar email del usuario administrador
-- Este script marca el email como confirmado para permitir el login

UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'admin@nominas.com';

-- Verificar que el usuario fue actualizado
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'admin@nominas.com';
