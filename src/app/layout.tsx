"use client";
import { useState, useEffect } from 'react';
import Preloader from '../app/components/Preloader'; // Adjust the path if necessary
import './globals.css';
import 'aos/dist/aos.css'; // AOS styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Delay for preloader and ensure the component is only removed after animation
    const preloaderDuration = 5000; // Give enough time for AOS to animate fully
    const timer = setTimeout(() => setLoading(false), preloaderDuration);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>My Puzzle Game</title>
      </head>
      <body>
        {loading ? (
          <Preloader /> // Show preloader only during loading
        ) : (
          <>
            {children} {/* Show main content after loading completes */}
          </>
        )}
      </body>
    </html>
  );
}
