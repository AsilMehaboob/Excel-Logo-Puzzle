"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import Preloader from '../../src/app/components/Preloader'; // Import your Preloader component
import './globals.css'; // Your global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
    setTimeout(() => setLoading(false), 3000); // Simulate loading for 3 seconds
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>My Puzzle Game</title>
      </Head>
      <body>
        {loading && <Preloader />} {/* Show preloader while loading */}
        {children}
      </body>
    </html>
  );
}
