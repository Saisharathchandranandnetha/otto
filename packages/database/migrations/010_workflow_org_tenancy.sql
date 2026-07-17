-- Migration 010: Workflow organization tenancy
-- Adds org_id to n8n workflow execution tables if they exist, or just creates a tenancy mapping

CREATE TABLE IF NOT EXISTS workflows.org_tenancy (
    workflow_id VARCHAR(255) PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
