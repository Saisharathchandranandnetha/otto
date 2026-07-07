-- Migration 004: Theme 2 cross-domain action families.

ALTER TABLE actions DROP CONSTRAINT IF EXISTS actions_type_check;
ALTER TABLE actions ADD CONSTRAINT actions_type_check CHECK (
  type IN (
    'invoice_commit',
    'reorder',
    'payment_reminder',
    'graduation_offer',
    'resurrection_commit',
    'admission_processing',
    'attendance_report',
    'workflow_approval',
    'document_generation',
    'support_response',
    'knowledge_answer',
    'personalization_plan'
  )
);
