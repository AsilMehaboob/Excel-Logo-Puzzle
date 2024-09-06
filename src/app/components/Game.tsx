"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import gsap from "gsap";
import RefreshButton from "./RefreshButton";
import Confetti from "./Confetti";

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
        2022: [
          "/images/2022_1.svg",
          "/images/2022_2.svg",
          "/images/2022_3.svg",
          "/images/2022_4.svg",
        ],
        2021: [
          "/images/2021_1.svg",
          "/images/2021_2.svg",
          "/images/2021_3.svg",
          "/images/2021_4.svg",
        ],
        2020: [
          "/images/2020_1.svg",
          "/images/2020_2.svg",
          "/images/2020_3.svg",
          "/images/2020_4.svg",
        ],
        2019: [
          "/images/2019_1.svg",
          "/images/2019_2.svg",
          "/images/2019_3.svg",
          "/images/2019_4.svg",
        ],
        2018: [
          "/images/2018_1.svg",
          "/images/2018_2.svg",
          "/images/2018_3.svg",
          "/images/2018_4.svg",
        ],
        2017: [
          "/images/2017_1.svg",
          "/images/2017_2.svg",
          "/images/2017_3.svg",
          "/images/2017_4.svg",
        ],
        2016: [
          "/images/2016_1.svg",
          "/images/2016_2.svg",
          "/images/2016_3.svg",
          "/images/2016_4.svg",
        ],
      };

      p.preload = () => {
        const yearKeys = Object.keys(imageSets);
        const randomYear = yearKeys[Math.floor(Math.random() * yearKeys.length)];
        selectedImages = imageSets[randomYear as keyof typeof imageSets];
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

            this.pieces.push({
              pos,
              img,
              i,
              correctPos,
              scaledWidth,
              scaledHeight,
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
          p.rect(this.x, this.y, this.boxWidth, this.boxHeight);

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
          if (this.isDragging && this.dragPiece) {
            let m = p.createVector(x, y);
            this.dragPiece.pos.set(m).add(this.clickOffset);
          }
        }

        public mouseReleased() {
          if (this.isDragging && this.dragPiece) {
            this.isDragging = false;
            this.snapTo(this.dragPiece);
            this.checkEndGame();
          }
        }

        private putOnTop(index: number) {
          this.pieces.splice(index, 1);
          if (this.dragPiece) {
            this.pieces.push(this.dragPiece);
          }
        }

        private snapTo(p: Piece) {
          if (p.pos.dist(p.correctPos) < Math.min(p.scaledWidth, p.scaledHeight) / 2) {
            p.pos = p.correctPos.copy();
          }
        }

        private checkEndGame() {
          let isComplete = this.pieces.every((p) => p.pos.equals(p.correctPos));

          if (isComplete && this.canPlay) {
            this.canPlay = false;

            setTimeout(() => {
              // Trigger flying off-screen animation for each piece
              this.pieces.forEach((piece) => {
                gsap.to(piece.pos, {
                  x: p.random(-500, p.windowWidth + 500),
                  y: p.random(-500, p.windowHeight + 500),
                  duration: 2,
                  ease: "power2.inOut",
                });
              });

              // Show the modal after the animation completes
              setTimeout(() => {
                setShowModal(true);
                setConfettiTriggered(true);
              }, 2000);
            }, 500);
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

  return (
    <div>
      <div ref={canvasRef} className="h-screen bg-gray-900 w-screen"></div>
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Puzzle Completed!</h2>
            <RefreshButton />
          </div>
        </div>
      )}
      {confettiTriggered && <Confetti />}
    </div>
  );
};

export default Puzzle;
