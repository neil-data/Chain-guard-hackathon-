import type {Metadata} from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChainGuard | Maritime Supply Chain Risk Intelligence',
  description: 'Predictive risk. Resilient supply. AI-powered supply chain resilience.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans antialiased text-brand-gray-1 bg-navy-900">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#112236',
              color: '#F0F4F8',
              border: '1px solid #1A3550',
              borderRadius: '16px',
            },
          }}
        />
      </body>
    </html>
  );
}
