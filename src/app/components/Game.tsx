"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import gsap from "gsap";


interface Piece {
  pos: p5.Vector;
  img: p5.Image;
  i: number;
  correctPos: p5.Vector;
  scaledWidth: number;
  scaledHeight: number;
}

const Puzzle = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const [countdown, setCountdown] = useState("");
  const launchDate = new Date("2024-09-10T15:00:00"); // Set your launch date here

  // Countdown Timer Logic
  // Countdown Timer Logic
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime(); // Get current time
      const timeLeft = launchDate.getTime() - now; // Time difference in milliseconds
  
      // If the countdown is finished
      if (timeLeft <= 0) {
        setCountdown("Logo is revealed!");
        return;
      }
  
      // Calculate hours, minutes, and seconds remaining
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
      // Update the countdown state
      setCountdown(`${hours} : ${minutes} : ${seconds} `);
    };
  
    // Start the countdown interval
    const interval = setInterval(updateCountdown, 1000);
  
    // Call once immediately to set initial value
    updateCountdown();
  
    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  


  useEffect(() => {
    const sketch = (p: p5) => {
      let puzzle: PuzzleGame | undefined;
      let images: p5.Image[] = [];
      let selectedImages: string[] = [];

      const imageSets = {
        2023: [
          "/images/2023_1.svg",
          "/images/2023_2.svg",
          "/images/2023_3.svg",
          "/images/2023_4.svg",
        ],
        // Add the rest of your image sets here...
      };

      p.preload = () => {
        const yearKeys = Object.keys(imageSets);
        const randomYear = yearKeys[Math.floor(Math.random() * yearKeys.length)];
        selectedImages = imageSets[randomYear as unknown as keyof typeof imageSets];
        selectedImages.forEach((url) => {
          images.push(p.loadImage(url));
        });
      };

      p.setup = () => {
        const canvasWidth = p.windowWidth;
        const canvasHeight = p.windowHeight;

        const canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent(canvasRef.current!);

        const boxSize = Math.min(400, canvasWidth * 0.8, canvasHeight * 0.8);
        const boxX = (canvasWidth - boxSize) / 2;
        const boxY = (canvasHeight - boxSize) / 2;

        puzzle = new PuzzleGame(boxX, boxY, boxSize, boxSize, images, 2); // 2x2 puzzle
      };

      p.draw = () => {
        p.clear();
        puzzle?.draw();
      };

      p.mousePressed = () => {
        puzzle?.mousePressed(p.mouseX, p.mouseY);
        return false;
      };

      p.mouseDragged = () => {
        puzzle?.mouseDragged(p.mouseX, p.mouseY);
        return false;
      };

      p.mouseReleased = () => {
        puzzle?.mouseReleased();
        return false;
      };

      p.touchStarted = () => {
        p.mousePressed();
        return false;
      };

      p.touchMoved = () => {
        p.mouseDragged();
        return false;
      };

      p.touchEnded = () => {
        p.mouseReleased();
        return false;
      };

      p.windowResized = () => {
        const canvasWidth = p.windowWidth;
        const canvasHeight = p.windowHeight;

        const boxSize = Math.min(400, canvasWidth * 0.8, canvasHeight * 0.8);
        const boxX = (canvasWidth - boxSize) / 2;
        const boxY = (canvasHeight - boxSize) / 2;

        p.resizeCanvas(canvasWidth, canvasHeight);
        puzzle?.updatePosition(boxX, boxY, boxSize, boxSize);
      };

      class PuzzleGame {
        private pieces: Piece[] = [];
        private dragPiece: Piece | null = null;
        private isDragging = false;
        private canPlay = true;
        private clickOffset: p5.Vector = new p5.Vector(0, 0);
        private x: number;
        private y: number;
        private boxWidth: number;
        private boxHeight: number;

        constructor(
          x: number,
          y: number,
          boxWidth: number,
          boxHeight: number,
          private imgs: p5.Image[],
          private side: number
        ) {
          this.x = x;
          this.y = y;
          this.boxWidth = boxWidth;
          this.boxHeight = boxHeight;
          this.placePieces(imgs);
        }

        private placePieces(imgs: p5.Image[]) {
          this.pieces = [];
        
          const pieceWidth = this.boxWidth / this.side;
          const pieceHeight = this.boxHeight / this.side;
          const manualPositions = [
            p.createVector(this.x + pieceWidth * 0.909, this.y + pieceHeight * 0.805),
            p.createVector(this.x + pieceWidth * 1.368, this.y + pieceHeight * 0.8),
            p.createVector(this.x + pieceWidth * 0.800, this.y + pieceHeight * 1.303),
            p.createVector(this.x + pieceWidth * 1.360, this.y + pieceHeight * 1.303),
          ];
        
          for (let i = 0; i < this.side * this.side; i++) {
            const img = imgs[i];
            const correctPos = manualPositions[i];
        
            const aspectRatio = img.width / img.height;
            let scaledWidth, scaledHeight;
        
            if (aspectRatio > 1) {
              scaledWidth = pieceWidth;
              scaledHeight = pieceWidth / aspectRatio;
            } else {
              scaledHeight = pieceHeight;
              scaledWidth = pieceHeight * aspectRatio;
            }
        
            const isAbove = i < Math.floor(this.side * this.side / 2);
            const pos = this.randomPos(scaledWidth, scaledHeight, isAbove);
        
            const piece = {
              pos,
              img,
              i,
              correctPos,
              // Increase the initial size from 0.5 to 0.75
              scaledWidth: scaledWidth * 0.75, // Adjust this value to increase the size
              scaledHeight: scaledHeight * 0.75, // Adjust this value to increase the size
            };
        
            this.pieces.push(piece);
        
            // Adjust the final scaling in the GSAP animation
            gsap.to(piece, {
              scaledWidth: scaledWidth, // Final width
              scaledHeight: scaledHeight, // Final height
              duration: 1.2,
              ease: "bounce.out",
              delay: i * 0.1,
            });
          }
        }
        
        private randomPos(pieceWidth: number, pieceHeight: number, isAbove: boolean) {
          const marginX = Math.min(
            50,
            (p.windowWidth - this.boxWidth) / 2 - pieceWidth
          );
          const marginY = Math.min(
            50,
            (p.windowHeight - this.boxHeight) / 2 - pieceHeight
          );

          let posX = p.random(
            Math.max(this.x - marginX, 0),
            Math.min(
              this.x + this.boxWidth + marginX,
              p.windowWidth - pieceWidth
            )
          );
          let posY = isAbove
            ? p.random(Math.max(0, this.y - marginY - pieceHeight), Math.max(0, this.y - marginY))
            : p.random(Math.min(p.windowHeight - pieceHeight, this.y + this.boxHeight + marginY), Math.min(p.windowHeight - pieceHeight, this.y + this.boxHeight + marginY + pieceHeight));

          return p.createVector(posX, posY);
        }

        public draw() {
          p.noFill();
          p.stroke(255);
          

          this.pieces.forEach((r) =>
            p.image(r.img, r.pos.x - r.scaledWidth / 2, r.pos.y - r.scaledHeight / 2, r.scaledWidth, r.scaledHeight)
          );
        }

        public mousePressed(x: number, y: number) {
          if (this.canPlay) {
            let m = p.createVector(x, y);
            let index: number | undefined;
            this.pieces.forEach((p, i) => {
              if (this.hits(p, m)) {
                this.clickOffset = p5.Vector.sub(p.pos, m);
                this.isDragging = true;
                this.dragPiece = p;
                index = i;
              }
            });
            if (this.isDragging && index !== undefined) {
              this.putOnTop(index);
            }
          }
        }

        private hits(p: Piece, hitpos: p5.Vector) {
          return (
            hitpos.x > p.pos.x - p.scaledWidth / 2 &&
            hitpos.x < p.pos.x + p.scaledWidth / 2 &&
            hitpos.y > p.pos.y - p.scaledHeight / 2 &&
            hitpos.y < p.pos.y + p.scaledHeight / 2
          );
        }

        public mouseDragged(x: number, y: number) {
          if (this.isDragging) {
            let dragpos = p.createVector(x, y);
            this.dragPiece!.pos = p5.Vector.add(dragpos, this.clickOffset);
          }
        }

        public mouseReleased() {
          if (this.dragPiece && this.isDragging) {
            const distToCorrectPos = this.dragPiece!.pos.dist(this.dragPiece!.correctPos);
            if (distToCorrectPos < 51) {
              this.dragPiece!.pos = this.dragPiece!.correctPos.copy();
            }
            this.isDragging = false;
            this.dragPiece = null;
        
            if (this.isComplete()) {
              this.canPlay = false;
        
              // GSAP animation to disperse pieces out of the display
              const tl = gsap.timeline({
                onComplete: () => {
                  // Show the modal only after the pieces have fully dispersed
                  setShowModal(true);
                }
              });
        
              this.pieces.forEach((piece, i) => {
                const direction = i % 4; // 4 different directions
                let targetX = piece.pos.x;
                let targetY = piece.pos.y;
        
                switch (direction) {
                  case 0: // Move to the top
                    targetY = -piece.scaledHeight * 2;
                    break;
                  case 1: // Move to the right
                    targetX = p.windowWidth + piece.scaledWidth * 2;
                    break;
                  case 2: // Move to the bottom
                    targetY = p.windowHeight + piece.scaledHeight * 2;
                    break;
                  case 3: // Move to the left
                    targetX = -piece.scaledWidth * 2;
                    break;
                }
        
                // Add animation to the timeline with staggered delay
                tl.to(piece.pos, {
                  x: targetX,
                  y: targetY,
                  duration: 2,
                  ease: "power3.inOut",
                }, i * 0.1); // Delay each piece slightly for a staggered effect
              });
            }
          }
        }
        
        

        private putOnTop(index: number) {
          const removed = this.pieces.splice(index, 1)[0];
          this.pieces.push(removed);
        }

        public updatePosition(
          x: number,
          y: number,
          boxWidth: number,
          boxHeight: number
        ) {
          this.x = x;
          this.y = y;
          this.boxWidth = boxWidth;
          this.boxHeight = boxHeight;
          this.placePieces(this.imgs);
        }

        private isComplete() {
          return this.pieces.every((p) => p.pos.equals(p.correctPos));
        }
      }
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, [confettiTriggered]);

  return (
    <div ref={canvasRef} className="relative w-full h-screen">
  

  {showModal && (
    <div className="absolute inset-0 bg-opacity-60 flex items-center justify-center">
      <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-8 text-center max-w-md shadow-lg border border-white border-opacity-30">
        <h1 className="text-3xl font-bold mb-4">
          Puzzle completed!<br/> You've uncovered the <br/> past—now brace yourself,
          the new logo will be revealed in:
        </h1>
        <p className="text-2xl font-semibold mb-4">{countdown}</p>
      </div>
    </div>
  )}
</div>

  );
  
};

export default Puzzle;
