// components/Preloader.tsx
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const counter3 = document.querySelector('.counter-3');
    const animateCounter = (counter: Element | null, duration: number, delay: number = 0) => {
      if (!counter) return;
      const numHeight = (counter.querySelector('.num') as HTMLElement)?.clientHeight || 0;
      const totalDistance = ((counter.querySelectorAll('.num')?.length || 1) - 1) * numHeight;
  
      gsap.to(counter, {
        y: -totalDistance,
        duration: duration,
        delay: delay,
        ease: 'power2.inOut',
      });
    };
    
    // Animate each counter
    animateCounter(counter3, 5);
    animateCounter(document.querySelector('.counter-2'), 6);
    animateCounter(document.querySelector('.counter-1'), 2, 4);
    
    gsap.to('.digit', {
      top: '-150px',
      stagger: {
        amount: 0.25,
      },
      delay: 6,
      duration: 1,
      ease: 'power4.inOut',
    });

    gsap.from('.loader-1', {
      width: 0,
      duration: 6,
      ease: 'power2.inOut',
    });

    gsap.from('.loader-2', {
      width: 0,
      duration: 6,
      delay: 1.9,
      ease: 'power2.inOut',
    });

    gsap.to('.loader', {
      background: 'none',
      delay: 6,
      duration: 0.1,
    });

    gsap.to('.loader-1', {
      rotate: 90,
      y: -50,
      duration: 0.5,
      delay: 6,
    });

    gsap.to('.loader-2', {
      x: -75,
      y: 75,
      duration: 0.5,
    });

    gsap.to('.loader', {
      scale: 40,
      duration: 1,
      delay: 7,
      ease: 'power2.inOut',
    });

    gsap.to('.loader', {
      rotate: 45,
      y: 500,
      x: 2000,
      duration: 1,
      delay: 7,
      ease: 'power2.inOut',
    });

    gsap.to('.loading-screen', {
      opacity: 0,
      duration: 0.5,
      delay: 7.5,
      ease: 'power1.inOut',
      onComplete: () => setLoading(false),
    });
  }, []);

  if (!loading) return null;

  return (
    <div className="loading-screen fixed top-0 left-0 w-full h-full bg-black text-white pointer-events-none z-50">
      <div className="loader flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[50px] bg-gray-600">
        <div className="loader-1 bg-white h-full w-2/3"></div>
        <div className="loader-2 bg-white h-full w-1/3"></div>
      </div>

      <div className="counter fixed left-12 bottom-12 flex space-x-2 text-[100px] leading-[102px] font-light">
        <div className="counter-1 relative top-[-12px]">
          <div className="num">0</div>
          <div className="num num1offset1">1</div>
        </div>
        <div className="counter-2 relative top-[-12px]">
          <div className="num">0</div>
          <div className="num num1offset2">1</div>
          <div className="num">2</div>
          <div className="num">3</div>
          <div className="num">4</div>
          <div className="num">5</div>
          <div className="num">6</div>
          <div className="num">7</div>
          <div className="num">8</div>
          <div className="num">9</div>
        </div>
        <div className="counter-3 relative top-[-12px]">
          <div className="num">0</div>
          <div className="num">1</div>
          <div className="num">2</div>
          <div className="num">3</div>
          <div className="num">4</div>
          <div className="num">5</div>
          <div className="num">6</div>
          <div className="num">7</div>
          <div className="num">8</div>
          <div className="num">9</div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
