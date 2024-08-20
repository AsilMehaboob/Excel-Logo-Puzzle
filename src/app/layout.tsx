// app/layout.tsx

import Head from 'next/head';
import './globals.css'; // Your global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>My Puzzle Game</title>
        <script src="/snapfit.js" async></script>
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
}
