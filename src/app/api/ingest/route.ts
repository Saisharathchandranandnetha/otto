// Ingest: multipart/form-data with files[] and mode ('single' = Flow A, 'resurrection' = Flow 0).
// Files are hashed (dedupe + cache key), stored under ./data/uploads, recorded in
// documents. Single mode: extract now → confirmation card (invoice_commit, awaiting_approval).
// Resurrection mode: batch pipeline with narrated build.
import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { sql } from '@/lib/db';
import { extract } from '@/extract/extractor';
import { InvoiceExtraction, fieldConfidences, needsReview } from '@/extract/schemas';
import { createAction, draftAction, transition } from '@/agent/machine';
import { runResurrection } from '@/agent/resurrection';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

function classifyKind(fileName: string): 'invoice' | 'ledger_page' | 'receipt' | 'whatsapp_export' {
  const ext = extname(fileName).toLowerCase();
  if (ext === '.txt') return 'whatsapp_export';
  const base = basename(fileName).toLowerCase();
  if (base.startsWith('ledger')) return 'ledger_page';
  if (base.startsWith('receipt')) return 'receipt';
  return 'invoice';
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const mode = (form.get('mode') as string | null) ?? 'single';
    const files = form.getAll('files').filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Validate file sizes (max 10MB each)
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `"${file.name}" exceeds 10MB limit` },
          { status: 413 },
        );
      }
    }

    mkdirSync('./data/uploads', { recursive: true });
    const docIds: string[] = [];

    for (const file of files) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const hash = createHash('sha256').update(bytes).digest('hex');
      const storagePath = join('./data/uploads', `${hash}${extname(file.name)}`);
      writeFileSync(storagePath, bytes);

      const [doc] = await sql`
        insert into documents (kind, file_name, file_hash, storage_path)
        values (${classifyKind(file.name)}, ${file.name}, ${hash}, ${storagePath})
        on conflict (file_hash) do update set file_name = excluded.file_name
        returning id`;
      if (doc) docIds.push(doc.id as string);
    }

    if (mode === 'resurrection') {
      const summary = await runResurrection(docIds);
      return NextResponse.json({ ok: true, summary });
    }

    // Flow A: single invoice → extraction → confirmation card
    if (docIds.length === 0) {
      return NextResponse.json({ error: 'No new documents to process' }, { status: 409 });
    }

    const docId = docIds[0]!;
    const [doc] = await sql`
      update documents set status = 'extracting' where id = ${docId}
      returning file_name, storage_path`;

    try {
      const bytes = Buffer.from(await files[0]!.arrayBuffer());
      const { data, model, fromCache } = await extract(
        { task: 'invoice', image: bytes, hint: doc!.fileName as string },
        InvoiceExtraction,
      );

      const review = needsReview(data);
      await sql`
        update documents set status = ${review ? 'review' : 'extracted'},
          extraction = ${sql.json(data as any)},
          field_confidence = ${sql.json(fieldConfidences(data) as any)}
        where id = ${docId}`;

      const lines = data.line_items.map((li) => ({
        product_name: li.product_name.value,
        qty: li.qty.value,
        unit_price: li.unit_price.value,
        amount: li.amount.value,
      }));

      const reasoning =
        `${data.direction.value === 'purchase' ? 'Supplier invoice from' : 'Sale to'} ` +
        `${data.counterparty_name.value}: ${lines.length} items, ` +
        `₹${data.total.value.toLocaleString('en-IN')}` +
        (review ? '. Some fields are low-confidence — highlighted for review.' : '.');

      const action = await createAction({
        type: 'invoice_commit',
        amount: data.total.value,
        reasoning,
        payload: {
          doc_id: docId,
          direction: data.direction.value,
          counterparty: data.counterparty_name.value,
          lines,
          total: data.total.value,
          invoice_no: data.invoice_no.value,
          invoice_date: data.invoice_date.value,
          due_date: data.due_date.value,
          extraction: data,
          field_confidence: fieldConfidences(data),
          needs_review: review,
          model,
          from_cache: fromCache,
        },
      });

      await draftAction(action.id, {
        reasoning: action.reasoning ?? '',
        detail: { model, from_cache: fromCache, needs_review: review },
      });
      await transition(action.id, 'drafted', 'awaiting_approval', {});

      return NextResponse.json({
        ok: true,
        actionId: action.id,
        needsReview: review,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await sql`
        update documents set status = 'failed', error = ${message}
        where id = ${docId}`;
      return NextResponse.json(
        { error: `Extraction failed: ${message}`, retry: true },
        { status: 422 },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
