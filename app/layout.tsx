import type {Metadata, Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Vespera Metal Loyalty Pass & B2B Console',
  description:
    'Interactive 3D brushed-titanium digital loyalty card with DeviceOrientation tilt, holographic sheen, 10-stamp grid, slide-up wallet drawer, and B2B merchant redemption dashboard.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vespera',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Vespera Metal Loyalty Pass & B2B Console',
    description:
      'Interactive 3D brushed-titanium digital loyalty card with DeviceOrientation tilt, holographic sheen, 10-stamp grid, slide-up wallet drawer, and B2B merchant redemption dashboard.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vespera Metal Loyalty Pass & B2B Console',
    description:
      'Interactive 3D brushed-titanium digital loyalty card with DeviceOrientation tilt, holographic sheen, 10-stamp grid, slide-up wallet drawer, and B2B merchant redemption dashboard.',
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
