import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Preloader = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS once with a 1s duration
  }, []);

  return (
    <div className="bg-cover bg-black text-white bg-center min-h-screen w-screen bg-desktop md:bg-mobile flex justify-center items-center h-screen font-clash-display">
      <div className="glassmorphism-background flex flex-col justify-center items-center text-center p-10 rounded-lg w-full h-full">
        <p data-aos="zoom-out-right" data-aos-delay="500">INSPIRE</p>
        <p data-aos="zoom-out-left" data-aos-delay="1000">INNOVATE</p>
        <p data-aos="zoom-out-right" data-aos-delay="1500">ENGINEER</p>
      </div>
    </div>
  );
};

export default Preloader;
