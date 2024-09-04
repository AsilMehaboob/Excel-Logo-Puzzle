import React, { useEffect, useState } from 'react';

interface TimerProps {
  start: boolean;
  onComplete?: (seconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ start, onComplete }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(start);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timer) {
        clearInterval(timer);
      }
      if (onComplete) {
        onComplete(seconds);
      }
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning && onComplete) {
      onComplete(seconds);
    }
  }, [isRunning, seconds, onComplete]);

  return (
    <div className="text-white text-lg p-4 bg-gray-800 rounded">
      <p>Time: {Math.floor(seconds / 60).toString().padStart(2, '0')}:
         {(seconds % 60).toString().padStart(2, '0')}
      </p>
    </div>
  );
};

export default Timer;
