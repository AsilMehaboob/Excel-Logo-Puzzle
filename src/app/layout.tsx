"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Preloader from '../app/components/Preloader'; // Adjust path to match your folder structure
import './globals.css'; // Your global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloaderDuration = 3000; // Ensure preloader fully completes

    setTimeout(() => setLoading(false), preloaderDuration); // Simulate loading duration
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>My Puzzle Game</title>
      </Head>
      <body
        style={{
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: 'cover', // Ensures the image covers the entire body
          backgroundPosition: 'center', // Centers the image
          backgroundRepeat: 'no-repeat', // Prevents image from repeating
          minHeight: '100vh' // Ensures the background covers the full viewport height
        }}
      >
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
