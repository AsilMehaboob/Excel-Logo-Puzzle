import { useEffect, useState } from "react";
import { Space_Mono } from "@next/font/google";

// Import Space Mono
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Preloader = () => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    let startNumber = 0;
    const endNumber = 100;
    const speed = 34;

    const increaseNumber = () => {
      if (startNumber <= endNumber) {
        if (startNumber === 58 || startNumber === 80 || startNumber === 32) {
          setTimeout(() => {
            if (startNumber <= endNumber) {
              // to ensure no further increments after 100
              setNumber(startNumber);
              startNumber += 1;
            }
          }, 650); // Pause at 32%, 58%, and 80%
        } else {
          setNumber(startNumber);
          startNumber += 1;
        }
      }
    };

    const interval = setInterval(() => {
      if (startNumber <= endNumber) {
        increaseNumber();
      } else {
        clearInterval(interval); // Stop when the count reaches 100
      }
    }, speed);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div
      className={`${spaceMono.className} text-white min-h-screen w-screen bg-desktop md:bg-mobile flex justify-center items-center h-screen ease-in-out`}
    >
      <div className="flex flex-col overflow-hidden justify-center items-center bg-[#0D0A2C] w-screen h-screen text-white max-md:text-[36px] text-[50px] font-semibold">
        <p>{number}%</p>
      </div>
    </div>
  );
};

export default Preloader;
