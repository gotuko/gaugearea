import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'GaugeArea Motor Rewind Calculator',
    short_name: 'GaugeArea',
    description: 'Industrial workshop tool for motor rewinding technicians to calculate equivalent multi-wire parallel SWG combinations.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/assets/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
