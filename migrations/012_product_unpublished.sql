-- Yayınlanmış ürünü katalogdan çekmek (redden ayrı durum)
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'products'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE products DROP CONSTRAINT IF EXISTS %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE products
  ADD CONSTRAINT products_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'unpublished'));
