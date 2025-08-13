-- Script para crear usuario administrador del sistema de nóminas
-- Este script debe ejecutarse después de que las tablas estén creadas

-- Insertar usuario administrador usando la función auth.users de Supabase
-- Nota: Este script requiere permisos de administrador en Supabase

-- Crear usuario administrador
-- Email: admin@nominas.com
-- Password: Admin123!

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@nominas.com',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  NOW(),
  '',
  NOW(),
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Administrador", "role": "admin"}',
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL
);

-- Crear identidad para el usuario
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'admin@nominas.com'),
  '{"sub": "' || (SELECT id FROM auth.users WHERE email = 'admin@nominas.com') || '", "email": "admin@nominas.com"}',
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Usuario administrador creado exitosamente:';
  RAISE NOTICE 'Email: admin@nominas.com';
  RAISE NOTICE 'Password: Admin123!';
  RAISE NOTICE 'Por favor cambie la contraseña después del primer login.';
END $$;
