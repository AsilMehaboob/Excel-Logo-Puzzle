import { useEffect, useState } from "react";

// Helper function to format time as mm:ss
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const Timer = ({ isRunning, onTimeUpdate }: { isRunning: boolean; onTimeUpdate: (time: number) => void }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // Only run the timer when the game is running
    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => {
          const updatedTime = prevTime + 1;
          onTimeUpdate(updatedTime); // Pass the updated time to the parent
          return updatedTime;
        });
      }, 1000); // Increment time every second
    }

    // Cleanup the timer when the component is unmounted or timer stops
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, onTimeUpdate]);

  return (
    <div className="absolute top-4 right-4 px-2 py-1 bg-transparent text-white border border-white border-opacity-50">
      <div className="text-sm mt-1">Time Elapsed: {formatTime(timeElapsed)}</div>
    </div>
  );
};

export default Timer;
