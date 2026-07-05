'use client';
// Mirror of outgoing WhatsApp messages. ALWAYS labeled — in sandbox mode it shows
// the same message that really went to the phone; in simulated mode it IS the
// disclosed fallback. Never let a judge discover an undisclosed simulation.
// Updated with M3 warm card styling + proper WhatsApp green (#25D366).
import { useMemo } from 'react';
import type { OttoEvent } from './useOtto';

export function SimulatedWhatsAppPane({ events }: { events: OttoEvent[] }) {
  const sends = useMemo(
    () => events.filter((e) => e.toState === 'whatsapp_send'),
    [events],
  );

  if (sends.length === 0) return null;

  const hasReal = sends.some((s) => s.detail.mode === 'sandbox');

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-[#25D366]/10 p-1.5 rounded-lg text-[#25D366]">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            chat
          </span>
        </div>
        <div>
          <h2 className="text-label-lg text-on-surface">WhatsApp</h2>
          <span className="text-label-sm text-on-surface-variant">
            {hasReal ? 'via Twilio sandbox' : 'simulated view'}
          </span>
        </div>
      </div>
      <div className="max-h-56 space-y-2 overflow-y-auto">
        {sends.map((s, i) => (
          <div
            key={s.id ?? i}
            className="animate-slide-in ml-4 rounded-lg rounded-tr-none
                       bg-[#005c4b]/90 p-2.5 text-[12px] leading-relaxed"
          >
            <p className="mb-1 text-[10px] tracking-wide text-[#8fbba9]">
              to{' '}
              {String(s.detail.to ?? '')
                .replace('whatsapp:', '')
                .slice(0, 16)}
              · {hasReal ? 'delivered' : 'simulated'}
            </p>
            <p className="text-[#e9edef]">
              {String(s.detail.body ?? '').slice(0, 200)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
