# Encryption Standards

## 1. Encryption in Transit
- **TLS/HTTPS:** All traffic between the browser and the Next.js application, as well as between Next.js and external APIs (Postgres, OpenRouter, Twilio), is encrypted using TLS 1.2 or higher.

## 2. Encryption at Rest
- **Database:** The Postgres 16 database (whether hosted on Supabase or AWS RDS) must have Encryption at Rest enabled using AES-256 for the underlying storage volumes.
- **Object Storage:** Uploaded photos (invoices, ledgers via the Shoebox Kit) must be encrypted at rest in the object storage bucket (e.g., AWS S3 SSE-S3 or Supabase Storage).

## 3. Application-Level Encryption
- Highly sensitive integration tokens (if businesses connect their own third-party tools to Otto in the future) should be symmetrically encrypted before being written to the database.
