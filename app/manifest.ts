import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Vespera Metal Loyalty Pass',
    short_name: 'Vespera',
    description:
      'Interactive 3D brushed-titanium digital loyalty card with anonymous local pass storage, 10-stamp grid, QR code, and B2B console.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0B0D11',
    theme_color: '#0B0D11',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
