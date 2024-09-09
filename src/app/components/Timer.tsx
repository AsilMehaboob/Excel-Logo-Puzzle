import { useEffect, useState } from "react";

interface TimerProps {
  isCompleted: boolean;
  startTime: number | null;
}

const Timer: React.FC<TimerProps> = ({ isCompleted, startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isCompleted && startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime) / 1000)); // Calculate elapsed time in seconds
      }, 1000);
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [isCompleted, startTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="timer">
      <h2>Time Elapsed: {formatTime(elapsedTime)}</h2>
    </div>
  );
};

export default Timer;
