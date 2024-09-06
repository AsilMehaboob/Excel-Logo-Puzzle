"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Preloader from '../app/components/Preloader'; // Adjust path to match your folder structure
import './globals.css'; // Your global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
    const preloaderDuration = 8000; // Ensure preloader fully completes

    setTimeout(() => setLoading(false), preloaderDuration); // Simulate loading duration
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>My Puzzle Game</title>
      </Head>
      <body>
        {loading ? (
          <Preloader /> // Show preloader while loading
        ) : (
          <>
            {children} {/* Show the main content once loading is complete */}
          </>
        )}
      </body>
    </html>
  );
}
