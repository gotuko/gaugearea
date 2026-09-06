import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Para Gauge | Motor Rewind Parallel Wire Calculator',
  description: 'Industrial workshop tool for motor rewinding technicians to calculate equivalent multi-wire parallel SWG combinations matching cross-sectional copper area.',
  openGraph: {
    title: 'Para Gauge | Motor Rewind Parallel Wire Calculator',
    description: 'Industrial workshop tool for motor rewinding technicians to calculate equivalent multi-wire parallel SWG combinations matching cross-sectional copper area.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Para Gauge | Motor Rewind Parallel Wire Calculator',
    description: 'Industrial workshop tool for motor rewinding technicians to calculate equivalent multi-wire parallel SWG combinations matching cross-sectional copper area.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
