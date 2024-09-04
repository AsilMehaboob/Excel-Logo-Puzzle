"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import RefreshButton from "./RefreshButton";
import Confetti from "./Confetti";

interface Piece {
  pos: p5.Vector;
  img: p5.Image;
  i: number;
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

      const set1 = [
        "/images/2023_1.png",
        "/images/2023_2.png",
        "/images/2023_3.png",
        "/images/2023_4.png",
      ];

      const set2 = [
        "/images/2022_1.png",
        "/images/2022_2.png",
        "/images/2022_3.png",
        "/images/2022_4.png",
      ];

      p.preload = () => {
        selectedImages = Math.random() > 0.5 ? set1 : set2;
        selectedImages.forEach((url) => {
          images.push(p.loadImage(url));
        });
      };

      p.setup = () => {
        const boxWidth = 400;
        const boxHeight = 400;
        const canvasWidth = p.windowWidth;
        const canvasHeight = p.windowHeight;
        const boxX = (canvasWidth - boxWidth) / 2;
        const boxY = (canvasHeight - boxHeight) / 2;

        const canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent(canvasRef.current!);

        puzzle = new PuzzleGame(boxX, boxY, boxWidth, boxHeight, images, 2); // 2x2 puzzle
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
        const boxWidth = Math.min(400, canvasWidth * 0.8); // Adjust width for smaller screens
        const boxHeight = Math.min(400, canvasHeight * 0.8); // Adjust height for smaller screens
        const boxX = (canvasWidth - boxWidth) / 2;
        const boxY = (canvasHeight - boxHeight) / 2;
      
        p.resizeCanvas(canvasWidth, canvasHeight);
        puzzle?.updatePosition(boxX, boxY, boxWidth, boxHeight);
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
          this.pieces = []; // Clear the pieces array to prevent duplicates
          
          const pieceWidth = this.boxWidth / this.side;
          const pieceHeight = this.boxHeight / this.side;

          imgs.forEach((img) => {
            img.resize(pieceWidth, pieceHeight);
          });

          for (let i = 0; i < this.side * this.side; i++) {
            let pos = this.randomPos(pieceWidth, pieceHeight);
            this.pieces.push({ pos, img: imgs[i], i });
          }
        }

        private randomPos(pieceWidth: number, pieceHeight: number) {
          // Ensure that pieces spawn within the canvas, considering screen size
          const marginX = Math.min(50, (p.windowWidth - this.boxWidth) / 2 - pieceWidth);
          const marginY = Math.min(50, (p.windowHeight - this.boxHeight) / 2 - pieceHeight);
        
          const posX = p.random(
            Math.max(this.x - marginX, 0),
            Math.min(this.x + this.boxWidth + marginX, p.windowWidth - pieceWidth)
          );
          const posY = p.random(
            Math.max(this.y - marginY, 0),
            Math.min(this.y + this.boxHeight + marginY, p.windowHeight - pieceHeight)
          );
        
          return p.createVector(posX, posY);
        }
        

        public draw() {
          p.noFill();
          p.stroke(255);
          p.rect(this.x, this.y, this.boxWidth, this.boxHeight);

          this.pieces.forEach((r) => p.image(r.img, r.pos.x, r.pos.y));
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
          const pieceWidth = this.boxWidth / this.side;
          const pieceHeight = this.boxHeight / this.side;
          return (
            hitpos.x > p.pos.x &&
            hitpos.x < p.pos.x + pieceWidth &&
            hitpos.y > p.pos.y &&
            hitpos.y < p.pos.y + pieceHeight
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
          const pieceWidth = this.boxWidth / this.side;
          const pieceHeight = this.boxHeight / this.side;
          for (let y = this.y; y < this.y + this.boxHeight; y += pieceHeight) {
            for (let x = this.x; x < this.x + this.boxWidth; x += pieceWidth) {
              if (this.shouldSnapToX(p, x, pieceWidth, pieceHeight, this.y + this.boxHeight)) {
                p.pos.x = x;
              }
              if (this.shouldSnapToY(p, y, pieceWidth, pieceHeight, this.x + this.boxWidth)) {
                p.pos.y = y;
              }
            }
          }
        }

        private shouldSnapToX(p: Piece, x: number, pieceWidth: number, pieceHeight: number, boxBottom: number) {
          return this.isOnGrid(p.pos.x, x, pieceWidth) && this.isInsideFrame(p.pos.y, this.y, boxBottom - pieceHeight, pieceHeight);
        }

        private shouldSnapToY(p: Piece, y: number, pieceWidth: number, pieceHeight: number, boxRight: number) {
          return this.isOnGrid(p.pos.y, y, pieceHeight) && this.isInsideFrame(p.pos.x, this.x, boxRight - pieceWidth, pieceWidth);
        }

        private isOnGrid(actualPos: number, gridPos: number, d: number) {
          return actualPos > gridPos - d && actualPos < gridPos + d;
        }

        private isInsideFrame(actualPos: number, frameStart: number, frameEnd: number, d: number) {
          return actualPos > frameStart - d && actualPos < frameEnd + d;
        }

        private checkEndGame() {
          let nrCorrectNeeded = this.side * this.side;
          let nrCorrect = 0;
          this.pieces.forEach((p) => {
            let correctIndex = p.i;
            const pieceWidth = this.boxWidth / this.side;
            const pieceHeight = this.boxHeight / this.side;
            let actualIndex =
              (p.pos.x - this.x) / pieceWidth + ((p.pos.y - this.y) / pieceHeight) * this.side;
            if (actualIndex === correctIndex) {
              nrCorrect++;
            }
          });
          if (nrCorrect === nrCorrectNeeded) {
            this.canPlay = false;
            setConfettiTriggered(true); // Trigger confetti
            setShowModal(true);
          }
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

          const pieceWidth = this.boxWidth / this.side;
          const pieceHeight = this.boxHeight / this.side;

          this.pieces.forEach((p) => {
            p.img.resize(pieceWidth, pieceHeight);
          });

          this.placePieces(this.imgs); // Reinitialize pieces with new positions
        }
      }
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center bg-black items-center h-screen">
        <div ref={canvasRef}>
        <RefreshButton />
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Congratulations!</h2>
              <p>You've completed the puzzle.</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Confetti trigger={confettiTriggered} onComplete={() => setConfettiTriggered(false)} />

    </div>
  );
};

export default Puzzle;