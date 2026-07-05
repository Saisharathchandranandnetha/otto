-- Otto schema v1 — plain SQL, runs identically on docker Postgres 16 and Supabase.
-- Design notes:
--  * agent_events is append-only: it is BOTH the audit trail and the live UI trace.
--  * actions.status transitions happen via UPDATE ... WHERE status = $expected
--    inside a transaction → idempotent approvals for free.
--  * Every entity extracted from a document carries source_doc_id + confidence:
--    "every agent decision is inspectable" is a schema property, not a slogan.

create extension if not exists pgcrypto;

-- ── Documents: every ingested file (photo, whatsapp export) ────────────────────
create table documents (
  id               uuid primary key default gen_random_uuid(),
  kind             text not null check (kind in ('invoice','ledger_page','receipt','whatsapp_export')),
  file_name        text not null,
  file_hash        text not null unique,        -- SHA-256; also the LLM cache key
  storage_path     text not null,               -- local path under ./data/uploads
  status           text not null default 'pending'
                     check (status in ('pending','extracting','extracted','review','confirmed','failed')),
  extraction       jsonb,                       -- Zod-validated extractor output
  field_confidence jsonb,                       -- { "vendor_name": 0.97, ... }
  error            text,
  created_at       timestamptz not null default now()
);

-- ── Business entities (all carry provenance) ───────────────────────────────────
create table suppliers (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text,
  aliases        text[] not null default '{}',  -- entity-resolution merges land here
  source_doc_id  uuid references documents(id),
  confidence     real,
  created_at     timestamptz not null default now()
);

create table customers (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text,
  aliases        text[] not null default '{}',
  dues_amount    numeric(12,2) not null default 0,   -- derived by inference pass; ledger is source of truth
  source_doc_id  uuid references documents(id),
  confidence     real,
  created_at     timestamptz not null default now()
);

create table products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  sku            text unique,
  unit           text not null default 'pcs',
  unit_price     numeric(12,2),
  stock_qty      numeric(12,2) not null default 0,
  reorder_point  numeric(12,2),               -- inferred from purchase frequency (Flow 0) or seeded
  reorder_qty    numeric(12,2),
  supplier_id    uuid references suppliers(id),
  price_history  jsonb not null default '[]', -- [{date, price, doc_id}]
  source_doc_id  uuid references documents(id),
  confidence     real,
  created_at     timestamptz not null default now()
);

create table invoices (
  id             uuid primary key default gen_random_uuid(),
  supplier_id    uuid references suppliers(id),
  invoice_no     text,
  invoice_date   date,
  due_date       date,
  total          numeric(12,2),
  line_items     jsonb not null default '[]', -- [{product_name, qty, unit_price, amount, product_id?}]
  doc_id         uuid references documents(id),
  status         text not null default 'recorded'
                   check (status in ('recorded','due','paid')),
  created_at     timestamptz not null default now()
);

create table ledger_entries (
  id             uuid primary key default gen_random_uuid(),
  entity_type    text not null check (entity_type in ('supplier','customer')),
  entity_id      uuid not null,
  direction      text not null check (direction in ('debit','credit')),
  amount         numeric(12,2) not null check (amount >= 0),
  description    text not null,
  source_doc_id  uuid references documents(id),
  action_id      uuid,                        -- set when created by an agent action (FK added below)
  created_at     timestamptz not null default now()
);

-- ── Agent core ──────────────────────────────────────────────────────────────────
create table actions (
  id             uuid primary key default gen_random_uuid(),
  type           text not null check (type in
                   ('invoice_commit','reorder','payment_reminder','graduation_offer','resurrection_commit')),
  status         text not null default 'perceived'
                   check (status in ('perceived','planned','drafted','awaiting_approval',
                                     'approved','rejected','executing','executed','undone','failed')),
  payload        jsonb not null default '{}', -- drafted PO / extraction ref / reminder text ...
  reasoning      text,                        -- agent's stated why (rendered on the card)
  amount         numeric(12,2),               -- money at stake — checked against trust cap
  approved_by    text check (approved_by in ('human','autonomy_grant')),
  trust_grant_id uuid,                        -- set when auto-approved (FK added below)
  undo_deadline  timestamptz,                 -- 1h window on auto-executed actions
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table ledger_entries
  add constraint ledger_entries_action_fk foreign key (action_id) references actions(id);

-- Append-only audit trail. Rendered live over SSE — this is the "not a wrapper" proof.
create table agent_events (
  id          bigint generated always as identity primary key,
  action_id   uuid references actions(id),
  from_state  text,
  to_state    text not null,                  -- also carries narration events: 'narration'
  detail      jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create table trust_grants (
  id              uuid primary key default gen_random_uuid(),
  action_type     text not null unique,
  approvals_count int not null default 0,
  autonomy_level  text not null default 'gated' check (autonomy_level in ('gated','autonomous')),
  amount_cap      numeric(12,2),
  offered_at      timestamptz,               -- graduation card surfaced
  granted_at      timestamptz,               -- owner tapped "Earn it, Otto"
  revoked_at      timestamptz,               -- one-toggle revoke
  created_at      timestamptz not null default now()
);

alter table actions
  add constraint actions_trust_grant_fk foreign key (trust_grant_id) references trust_grants(id);

-- ── Indexes for the hot paths (feed tail, SSE cursor, trigger scans) ───────────
create index idx_agent_events_action  on agent_events(action_id);
create index idx_agent_events_id      on agent_events(id);            -- SSE cursor: WHERE id > $last
create index idx_actions_status       on actions(status);
create index idx_actions_created      on actions(created_at desc);
create index idx_products_reorder     on products(id) where reorder_point is not null;
create index idx_ledger_entity        on ledger_entries(entity_type, entity_id);
