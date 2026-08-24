-- Başvuru tipi + esnek cevaplar
ALTER TABLE developer_applications
  ADD COLUMN IF NOT EXISTS applicant_type VARCHAR(32) NOT NULL DEFAULT 'developer';

ALTER TABLE developer_applications
  ADD COLUMN IF NOT EXISTS answers JSONB NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'developer_applications_applicant_type_check'
  ) THEN
    ALTER TABLE developer_applications
      ADD CONSTRAINT developer_applications_applicant_type_check
      CHECK (applicant_type IN ('developer', 'entrepreneur'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_developer_applications_type
  ON developer_applications (applicant_type, status);
