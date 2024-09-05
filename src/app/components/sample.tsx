"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";
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

      const set1 = [
        "/images/1.png",
        "/images/2.png",
        "/images/3.png",
        "/images/4.png",
      ];

      const set2 = [
        "/images/1.png",
        "/images/2.png",
        "/images/3.png",
        "/images/4.png",
      ];

      p.preload = () => {
        selectedImages = Math.random() > 0.5 ? set1 : set2;
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
            p.createVector(this.x + pieceWidth * 0.6, this.y + pieceHeight * 0.69),
            p.createVector(this.x + pieceWidth * 1.32, this.y + pieceHeight * 0.60),
            p.createVector(this.x + pieceWidth * 0.69, this.y + pieceHeight * 1.41),
            p.createVector(this.x + pieceWidth * 1.405, this.y + pieceHeight * 1.32),
          ];

          for (let i = 0; i < this.side * this.side; i++) {
            const row = Math.floor(i / this.side);
            const col = i % this.side;

            // Calculate the center of the correct position for the piece
            const correctPos = manualPositions[i];

            const img = imgs[i];
            const aspectRatio = img.width / img.height;
            let scaledWidth, scaledHeight;

            if (aspectRatio > 1) {
              // Image is wider than tall
              scaledWidth = pieceWidth;
              scaledHeight = pieceWidth / aspectRatio;
            } else {
              // Image is taller than wide or square
              scaledHeight = pieceHeight;
              scaledWidth = pieceHeight * aspectRatio;
            }

            // Randomize initial position
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

        private randomPos(
          pieceWidth: number,
          pieceHeight: number,
          isAbove: boolean
        ) {
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
          let posY;

          if (isAbove) {
            posY = p.random(
              Math.max(0, this.y - marginY - pieceHeight),
              Math.max(0, this.y - marginY)
            );
          } else {
            posY = p.random(
              Math.min(
                p.windowHeight - pieceHeight,
                this.y + this.boxHeight + marginY
              ),
              Math.min(
                p.windowHeight - pieceHeight,
                this.y + this.boxHeight + marginY + pieceHeight
              )
            );
          }

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
          // Align the piece's center with the center of its correct position
          if (
            p.pos.dist(p.correctPos) <
            Math.min(p.scaledWidth, p.scaledHeight) / 2
          ) {
            p.pos = p.correctPos.copy();
          }
        }

        private checkEndGame() {
          let correctPieces = 0;
          this.pieces.forEach((p) => {
            if (p.pos.equals(p.correctPos)) {
              correctPieces++;
            }
          });
          if (correctPieces === this.side * this.side) {
            this.canPlay = false;
            setShowModal(true);
            setConfettiTriggered(true);
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
          this.placePieces(this.imgs);
        }
      }
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-violet-400">
      {confettiTriggered && <Confetti trigger={false} onComplete={function (): void {
        throw new Error("Function not implemented.");
      } } />}
      <div ref={canvasRef}></div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow">
            <h2 className="text-2xl mb-4">Congratulations!</h2>
            <p className="mb-4">You've completed the puzzle!</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <RefreshButton />
    </div>
  );
};

export default Puzzle;