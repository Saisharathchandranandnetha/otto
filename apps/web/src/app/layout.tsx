import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    template: '%s | Otto',
    default: 'Otto — your business, running itself',
  },
  description:
    'Otto installs itself in 3 minutes from a pile of paper invoices and WhatsApp chats, then runs your small business through an approval feed — earning autonomy as you trust it more.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Otto — the AI operator for small businesses',
    description:
      'Drop your shoebox of papers in. Otto reads everything, reconstructs your whole business, and operates it through an approval feed you can trust.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#fbf9f5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-on-surface antialiased selection:bg-primary/15">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
