"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';

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
  const [elapsedTime, setElapsedTime] = useState(0); // Timer state
  const [isCompleted, setIsCompleted] = useState(false); // Completion state
  const [startTime, setStartTime] = useState<number | null>(null); // Start time state

  // Start the timer when the puzzle starts
  useEffect(() => {
    if (!isCompleted && startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime) / 1000)); // Update every second
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCompleted, startTime]);

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
        setStartTime(new Date().getTime()); // Set the start time
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
            p.createVector(this.x + pieceWidth * 0.909, this.y + pieceHeight * 0.905),
            p.createVector(this.x + pieceWidth * 1.368, this.y + pieceHeight * 0.9),
            p.createVector(this.x + pieceWidth * 0.800, this.y + pieceHeight * 1.403),
            p.createVector(this.x + pieceWidth * 1.360, this.y + pieceHeight * 1.403),
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
              scaledWidth: scaledWidth * 1,
              scaledHeight: scaledHeight * 1,
            };
        
            this.pieces.push(piece);
        
            gsap.to(piece, {
              scaledWidth: scaledWidth,
              scaledHeight: scaledHeight,
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

        private putOnTop(index: number) {
          if (this.dragPiece) {
            this.pieces.splice(index, 1);
            this.pieces.push(this.dragPiece);
          }
        }

        public mouseDragged(x: number, y: number) {
          if (this.isDragging && this.dragPiece) {
            this.dragPiece.pos = p.createVector(x, y).add(this.clickOffset);
          }
        }

        public mouseReleased() {
          if (this.isDragging && this.dragPiece) {
            this.isDragging = false;
            const validDrop = p.dist(this.dragPiece.pos.x, this.dragPiece.pos.y, this.dragPiece.correctPos.x, this.dragPiece.correctPos.y) < 60;

            if (validDrop) {
              gsap.to(this.dragPiece.pos, {
                x: this.dragPiece.correctPos.x,
                y: this.dragPiece.correctPos.y,
                duration: 0.4,
                ease: "bounce.out",
              });

              const isDone = this.pieces.every((piece) =>
                p.dist(piece.pos.x, piece.pos.y, piece.correctPos.x, piece.correctPos.y) < 5
              );

              if (isDone) {
                this.canPlay = false;
                // Trigger confetti and show modal
                setTimeout(() => {
                  confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
                  setShowModal(true);
                  setIsCompleted(true);
                }, 800);
              }
            }
          }
        }

        public updatePosition(x: number, y: number, boxWidth: number, boxHeight: number) {
          this.x = x;
          this.y = y;
          this.boxWidth = boxWidth;
          this.boxHeight = boxHeight;
        }
      }
    };

    const myp5 = new p5(sketch);

    return () => {
      myp5.remove();
    };
  }, []);

  // Timer Display Function
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Puzzle Timer */}
      {!isCompleted && (
        <div className="absolute top-10 left-10 bg-white p-2 rounded shadow-lg">
          <p className="text-xl font-bold">Time: {formatTime(elapsedTime)}</p>
        </div>
      )}

      <div ref={canvasRef} className="w-full h-full" />

      {/* Puzzle Completion Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-10 rounded shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Puzzle Complete!</h2>
              <p className="text-xl">
                Congratulations! You completed the puzzle in{" "}
                <span className="font-bold">{formatTime(elapsedTime)}</span>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Puzzle;
