import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Nebula Mail - AI-Powered Mail OS',
  description: 'AI-Powered Mail Application where the AI Assistant controls the UI programmatically.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable} h-full antialiased bg-white`}>
      <body className="font-sans bg-white text-slate-900 h-full flex flex-col m-0 p-0 overflow-hidden selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
