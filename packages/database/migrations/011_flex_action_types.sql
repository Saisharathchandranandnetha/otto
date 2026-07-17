-- Migration 011: Flex Action Types
ALTER TABLE actions DROP CONSTRAINT IF EXISTS actions_type_check;
