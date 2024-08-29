// Confetti.tsx
"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  trigger: boolean;
  onComplete: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  useEffect(() => {
    if (trigger) {
      // Trigger confetti
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
      });
      // Call the onComplete callback after the confetti animation
      setTimeout(onComplete, 3000); // Adjust timing as needed
    }
  }, [trigger, onComplete]);

  return null;
};

export default Confetti;
