-- users.role düzeltmesi (PostgreSQL — TablePlus'ta çalıştırın)
-- Kayıt API'si role = 'user' gönderir; sütunda DEFAULT ve CHECK doğru olmalı.

-- Yanlış/boş kayıtları düzelt (TablePlus'ta hücrede "DEFAULT" yazıyorsa veya NULL ise)
UPDATE users
SET role = 'user'
WHERE role IS NULL
   OR TRIM(role) = ''
   OR UPPER(TRIM(role)) = 'DEFAULT'
   OR role NOT IN ('user', 'vendor', 'admin');

-- Yeni satırlarda otomatik 'user'
ALTER TABLE users
  ALTER COLUMN role SET DEFAULT 'user';

ALTER TABLE users
  ALTER COLUMN role SET NOT NULL;

-- CHECK kısıtı (şema ile aynı: user | vendor | admin)
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('user', 'vendor', 'admin'));

-- Kontrol (isteğe bağlı — sonuçları TablePlus'ta görün)
-- SELECT column_name, column_default, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'users' AND column_name = 'role';
