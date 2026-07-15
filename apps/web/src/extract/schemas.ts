// THE SCHEMA LOCK. These Zod schemas are the single source of truth for every LLM
// boundary. The JSON schema sent to the model is derived from them (structured
// output), so the model physically cannot return fields outside the schema — an
// injected instruction inside a document has no field to land in. Every leaf field
// carries its own confidence; anything < CONFIDENCE_REVIEW_THRESHOLD renders
// highlighted-for-review and blocks silent commits.
import { z } from 'zod';

export const CONFIDENCE_REVIEW_THRESHOLD = 0.75;

/** A field the model must both extract AND self-score. */
const cf = <T extends z.ZodTypeAny>(inner: T) =>
  z.object({
    value: inner,
    confidence: z.number().min(0).max(1),
  });

export type ConfidentField<T> = { value: T; confidence: number };

// ── Invoice (Flow A + Flow 0 batch) ─────────────────────────────────────────────
export const InvoiceLineItem = z.object({
  product_name: cf(z.string()),
  qty: cf(z.number()),
  unit_price: cf(z.number()),
  amount: cf(z.number()),
});

export const InvoiceExtraction = z.object({
  doc_type: z.literal('invoice'),
  /** purchase = issued BY a supplier TO us (stock in) · sale = issued BY us TO a customer (stock out) */
  direction: cf(z.enum(['purchase', 'sale'])),
  counterparty_name: cf(z.string()), // supplier (purchase) or customer (sale)
  vendor_name: cf(z.string()),
  vendor_phone: cf(z.string().nullable()),
  invoice_no: cf(z.string().nullable()),
  invoice_date: cf(z.string().nullable()), // YYYY-MM-DD
  due_date: cf(z.string().nullable()),
  line_items: z.array(InvoiceLineItem),
  total: cf(z.number()),
  currency: cf(z.string()), // "INR" expected
});
export type InvoiceExtraction = z.infer<typeof InvoiceExtraction>;

// ── Handwritten ledger page (Flow 0) ────────────────────────────────────────────
export const LedgerRow = z.object({
  party_name: cf(z.string()),
  description: cf(z.string().nullable()),
  debit: cf(z.number().nullable()),   // party owes us
  credit: cf(z.number().nullable()),  // payment received
  date: cf(z.string().nullable()),
});

export const LedgerPageExtraction = z.object({
  doc_type: z.literal('ledger_page'),
  page_label: cf(z.string().nullable()),
  rows: z.array(LedgerRow),
});
export type LedgerPageExtraction = z.infer<typeof LedgerPageExtraction>;

// ── WhatsApp Business chat export (.txt — parsed for entities/orders/promises) ──
export const WhatsAppContact = z.object({
  name: cf(z.string()),
  phone: cf(z.string().nullable()),
  role_guess: cf(z.enum(['customer', 'supplier', 'unknown'])),
  signals: z.array(
    z.object({
      kind: z.enum(['order', 'payment_promise', 'payment_made', 'supply_confirmation', 'other']),
      summary: cf(z.string()),
      amount: cf(z.number().nullable()),
      date: cf(z.string().nullable()),
    }),
  ),
});

export const WhatsAppExtraction = z.object({
  doc_type: z.literal('whatsapp_export'),
  contacts: z.array(WhatsAppContact),
});
export type WhatsAppExtraction = z.infer<typeof WhatsAppExtraction>;

// ── Entity resolution (Flow 0: one pass over all extracted entities) ───────────
export const EntityMerge = z.object({
  canonical_name: z.string(),
  entity_type: z.enum(['supplier', 'customer', 'product']),
  merged_aliases: z.array(z.string()),
  phone: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  evidence: z.string(), // why the model believes these are the same entity
});

export const EntityResolutionResult = z.object({
  merges: z.array(EntityMerge),
});
export type EntityResolutionResult = z.infer<typeof EntityResolutionResult>;

// ── Union used by the batch pipeline ────────────────────────────────────────────
export const AnyExtraction = z.discriminatedUnion('doc_type', [
  InvoiceExtraction,
  LedgerPageExtraction,
  WhatsAppExtraction,
]);
export type AnyExtraction = z.infer<typeof AnyExtraction>;

/** Collect every leaf-field confidence, keyed by JSON path — drives review highlighting. */
export function fieldConfidences(obj: unknown, path = ''): Record<string, number> {
  const out: Record<string, number> = {};
  if (obj === null || typeof obj !== 'object') return out;
  const record = obj as Record<string, unknown>;
  if (typeof record.confidence === 'number' && 'value' in record) {
    out[path] = record.confidence as number;
    return out;
  }
  for (const [key, val] of Object.entries(record)) {
    const childPath = path ? `${path}.${key}` : key;
    if (Array.isArray(val)) {
      val.forEach((item, i) => Object.assign(out, fieldConfidences(item, `${childPath}[${i}]`)));
    } else if (typeof val === 'object' && val !== null) {
      Object.assign(out, fieldConfidences(val, childPath));
    }
  }
  return out;
}

/** True if any field on the extraction needs human review. */
export function needsReview(obj: unknown): boolean {
  return Object.values(fieldConfidences(obj)).some((c) => c < CONFIDENCE_REVIEW_THRESHOLD);
}
