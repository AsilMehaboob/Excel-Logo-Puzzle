import { useEffect, useState } from "react";
import { Space_Mono } from "@next/font/google";
import "aos/dist/aos.css";
import AOS from "aos";

// Import Space Mono
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you need
});

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const useHackerEffect = (text: string, delay: number) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS once with a 1s duration
  }, []);

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startHackerEffect = () => {
      interval = setInterval(() => {
        setDisplayText((prev) =>
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index]; // Reveal the actual letter when iteration catches up
              }
              return letters[Math.floor(Math.random() * 26)]; // Random letter scrambling
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
          setIsComplete(true);
        }

        iteration += 1 / 3; // Controls the speed of letter revealing
      }, 50); // Controls the speed of letter scrambling
    };

    const typingDelay = setTimeout(startHackerEffect, delay); // Delay before starting the effect

    return () => {
      clearTimeout(typingDelay);
      clearInterval(interval);
    };
  }, [text, delay]);

  return { displayText, isComplete };
};

const Preloader = () => {
  const { displayText: inspireText } = useHackerEffect("INSPIRE", 600);
  const { displayText: innovateText } = useHackerEffect("INNOVATE", 1200);
  const { displayText: engineerText } = useHackerEffect("ENGINEER", 2100);

  return (
    <div
      className={`${spaceMono.className} bg-cover bg-black text-white bg-center min-h-screen w-screen bg-desktop md:bg-mobile flex justify-center items-center h-screen`}
    >
      <div className="glassmorphism-background flex flex-col justify-center text-[30px] font-medium items-center gap-[0px] text-center p-10 rounded-lg w-full h-full">
        <p data-aos="zoom-in" data-aos-delay="500"  data-aos-easing="ease-in-out">
          <span>{inspireText}</span>
        </p>
        <p data-aos="zoom-in" data-aos-delay="1100"  data-aos-easing="ease-in-out">
          <span>{innovateText}</span>
        </p>
        <p data-aos="zoom-in" data-aos-delay="2000"  data-aos-easing="ease-in-out">
          <span>{engineerText}</span>
        </p>
      </div>
    </div>
  );
};

export default Preloader;
