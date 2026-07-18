// Serves generated PO HTML files from ./data/pos (linked from reorder cards + WhatsApp).
// Print-to-PDF in the browser for the PDF version. Also serves the live demo invoice photos.
import { existsSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ poNumber: string }> },
) {
  const { poNumber } = await params;
  const safe = basename(poNumber).replace(/[^A-Za-z0-9-]/g, '');

  // PO HTML
  const htmlPath = join('./data/pos', `${safe}.html`);
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf8');
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return NextResponse.json({ error: 'PO not found' }, { status: 404 });
}
