-- Migration 003: Education Module

-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Knowledge Documents (Ask Otto)
CREATE TABLE knowledge_documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category    TEXT NOT NULL CHECK (category IN ('fees','admissions','schedule','policy')),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  audience    TEXT NOT NULL CHECK (audience IN ('student','parent','staff')),
  embedding   vector(1536),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Conversations (Ask Otto)
CREATE TABLE conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audience    TEXT NOT NULL CHECK (audience IN ('student','parent','staff')),
  messages    JSONB NOT NULL DEFAULT '[]', -- [{role: 'user', content: '...'}, {role: 'assistant', content: '...', source_ids: [...]}]
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Generated Documents (Documents Tab)
CREATE TABLE generated_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL CHECK (type IN ('admission_letter','fee_invoice','report_card','question_paper','circular')),
  recipient_name  TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','ready','sent')),
  content_ref     TEXT, -- e.g. path or URL to the generated PDF/HTML
  tenant_id       UUID, -- Required by the prompt
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Recommendations (For You Tab)
CREATE TABLE recommendations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      TEXT,
  class_id        TEXT,
  type            TEXT NOT NULL, -- e.g., attendance_deviation, quiz_score_trend, response_rate
  reasoning       TEXT NOT NULL,
  computed_from   JSONB NOT NULL, -- references specific data points
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  dismissed_at    TIMESTAMPTZ
);

-- 5. Modify actions.type to include education types
ALTER TABLE actions DROP CONSTRAINT actions_type_check;
ALTER TABLE actions ADD CONSTRAINT actions_type_check CHECK (
  type IN (
    'invoice_commit', 'reorder', 'payment_reminder', 'graduation_offer', 'resurrection_commit',
    'admission_processing', 'attendance_report'
  )
);
