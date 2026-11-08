import type {Metadata, Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Sissi Heritage Loyalty Pass & B2B Console',
  description:
    'Interactive 3D digital loyalty card with DeviceOrientation tilt, 8-stamp grid, PWA shortcut, and B2B merchant console for Sissi Heritage.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sissi Heritage',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Sissi Heritage Loyalty Pass & B2B Console',
    description:
      'Interactive 3D digital loyalty card with DeviceOrientation tilt, 8-stamp grid, PWA shortcut, and B2B merchant console for Sissi Heritage.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sissi Heritage Loyalty Pass & B2B Console',
    description:
      'Interactive 3D digital loyalty card with DeviceOrientation tilt, 8-stamp grid, PWA shortcut, and B2B merchant console for Sissi Heritage.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-[#000000] text-[#F5F5F7] antialiased selection:bg-[#0071E3]/30 selection:text-white"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </body>
    </html>
  );
}
