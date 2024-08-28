// app/layout.tsx
"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Preloader from '../../src/app/components/Preloader'; // Import your Preloader component
import './globals.css'; // Your global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demonstration; replace with actual loading logic
    setTimeout(() => setLoading(false), 3000); // 3 seconds loading time
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>My Puzzle Game</title>
        <script src="/snapfit.js" async></script>
      </Head>
      <body>
        {loading && <Preloader />} {/* Show preloader while loading */}
        {children}
      </body>
    </html>
  );
}
