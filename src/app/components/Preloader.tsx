import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Preloader = () => {
  const puzzleRef = useRef<SVGSVGElement | null>(null);
  const pieceRefs = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    const puzzle = puzzleRef.current;
    const pieces = pieceRefs.current;

    const speed1 = 0.5;
    const speed2 = 0.5;

    gsap.defaults({ ease: "expo.out" });

    const tl = gsap.timeline({
      onComplete: function () {
        this.invalidate();
        this.restart();
      }
    });

    tl.staggerTo(pieces, speed1, {
      scale: 0.7,
      transformOrigin: "50% 50%",
      ease: "bounce.out",
    }, 0.07)
      .to(puzzle, speed2, {
        rotation: "+=45",
        ease: "back.inOut",
      })
      .to(pieces, speed1, {
        scale: 1,
        ease: "expo.inOut",
      })
      .to(puzzle, speed2, {
        rotation: "+=45",
        ease: "back.inOut",
      });

  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <svg ref={puzzleRef} className="w-20 cursor-pointer" viewBox="224 -224 512 512">
        <path ref={(el) => { if (el) pieceRefs.current[0] = el }} className="st0 piece fill-[#081c4e]" d="M660,17c0-33-27-60-60-60c-33,0-60,27-60,60c0,5.1,0.6,10.2,1.8,15H525h-45v61.9 c4.9-1.2,9.9-1.9,15-1.9c33.1,0,60,26.9,60,60s-26.9,60-60,60c-5.1,0-10.1-0.6-15-1.9V288h211c24.9,0,45-20.1,45-45V32h-77.8 C659.4,27.2,660,22.1,660,17z" />
        <path ref={(el) => { if (el) pieceRefs.current[1] = el }} className="st1 piece fill-[#FFA69E]" d="M495,212c33.1,0,60-26.9,60-60s-26.9-60-60-60c-5.1,0-10.1,0.6-15,1.9V32h-15h-46.9 c1.2,4.9,1.9,9.9,1.9,15c0,33.1-26.9,60-60,60s-60-26.9-60-60c0-5.1,0.6-10.1,1.9-15H224v211c0,24.9,20.1,45,45,45h196h15v-77.9 C484.9,211.4,489.9,212,495,212z" />
        <path ref={(el) => { if (el) pieceRefs.current[2] = el }} className="st2 piece fill-[#FF686B]" d="M300,47c0,33.1,26.9,60,60,60s60-26.9,60-60c0-5.1-0.6-10.1-1.9-15H465h15v-61.8 c-4.8,1.2-9.9,1.8-15,1.8c-33,0-60-27-60-60c0-33,27-60,60-60c5.1,0,10.2,0.6,15,1.8V-224H269c-24.9,0-45,20.1-45,45V32h77.9 C300.6,36.9,300,41.9,300,47z" />
        <path ref={(el) => { if (el) pieceRefs.current[3] = el }} className="st3 piece fill-[#A5FFD6]" d="M691-224H525h-45v77.8c-4.8-1.2-9.9-1.8-15-1.8c-33,0-60,27-60,60c0,33,27,60,60,60 c5.1,0,10.2-0.6,15-1.8V32h45h16.8c-1.2-4.8-1.8-9.9-1.8-15c0-33,27-60,60-60c33,0,60,27,60,60c0,5.1-0.6,10.2-1.8,15H736v-211 C736-203.9,715.9-224,691-224z" />
      </svg>
    </div>
  );
};

export default Preloader;