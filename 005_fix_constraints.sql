-- Migration 005: Consolidate action type constraint.
-- Ensures all action types used by the 8 Theme 2 domain executors
-- and core Otto flows are valid. Safe to run multiple times.

ALTER TABLE actions DROP CONSTRAINT IF EXISTS actions_type_check;
ALTER TABLE actions ADD CONSTRAINT actions_type_check CHECK (
  type IN (
    -- Core Otto flows
    'invoice_commit',
    'reorder',
    'payment_reminder',
    'graduation_offer',
    'resurrection_commit',
    -- Education legacy types
    'admission_processing',
    'attendance_report',
    -- Theme 2 cross-domain action families (all 5 used by 8 domains)
    'workflow_approval',
    'document_generation',
    'support_response',
    'knowledge_answer',
    'personalization_plan'
  )
);
