-- Migration 002: Add internationalization support

-- Track the language of the source document for context
ALTER TABLE documents 
ADD COLUMN source_language text DEFAULT 'en';

-- Track the preferred language for communication (WhatsApp reminders, etc)
ALTER TABLE customers 
ADD COLUMN preferred_language text DEFAULT 'en';

ALTER TABLE suppliers 
ADD COLUMN preferred_language text DEFAULT 'en';
