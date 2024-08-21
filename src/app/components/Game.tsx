"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";

interface Piece {
  pos: p5.Vector;
  img: p5.Image;
  i: number;
}

const Puzzle = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const sketch = (p: p5) => {
      let puzzle: PuzzleGame;
      let imgCb: p5.Image;

      p.preload = () => {
        imgCb = p.loadImage(
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/15499/badge.png"
        );
      };

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(canvasRef.current!);
        let x0 = p.windowWidth / 2 - imgCb.width / 2;
        let y0 = p.windowHeight / 2 - imgCb.height / 2;
        puzzle = new PuzzleGame(x0, y0, imgCb, 2); // 2x2 puzzle
      };

      p.draw = () => {
        p.clear();
        puzzle.draw();
      };

      p.mousePressed = () => {
        puzzle.mousePressed(p.mouseX, p.mouseY);
        return false; // Prevent default behavior (optional)
      };

      p.mouseDragged = () => {
        puzzle.mouseDragged(p.mouseX, p.mouseY);
        return false; // Prevent default behavior (optional)
      };

      p.mouseReleased = () => {
        puzzle.mouseReleased();
        return false; // Prevent default behavior (optional)
      };

      p.touchStarted = () => {
        p.mousePressed();
        return false; // Prevent default behavior
      };

      p.touchMoved = () => {
        p.mouseDragged();
        return false; // Prevent default behavior
      };

      p.touchEnded = () => {
        p.mouseReleased();
        return false; // Prevent default behavior
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      class PuzzleGame {
        private pieces: Piece[] = [];
        private dragPiece: Piece | null = null;
        private isDragging = false;
        private canPlay = true;
        private clickOffset: p5.Vector = new p5.Vector(0, 0);
        private w: number;
        private h: number;

        constructor(
          private x: number,
          private y: number,
          private img: p5.Image,
          private side: number
        ) {
          this.w = img.width / side;
          this.h = img.height / side;
          this.placePieces();
        }

        private placePieces() {
          for (let y = 0; y < this.side; y++) {
            for (let x = 0; x < this.side; x++) {
              let img = p.createImage(this.w, this.h);
              img.copy(
                this.img,
                this.w * x,
                this.h * y,
                this.w,
                this.h,
                0,
                0,
                this.w,
                this.h
              );
              let pos = this.randomPos(this.w, this.h);
              let index = x + y * this.side;
              this.pieces.push({ pos, img, i: index });
            }
          }
        }

        private randomPos(marginRight: number, marginBottom: number) {
          return p.createVector(
            p.random(0, p.windowWidth - marginRight),
            p.random(0, p.windowHeight - marginBottom)
          );
        }

        public draw() {
          p.rect(this.x - 1, this.y - 1, this.img.width + 1, this.img.height + 1);
          p.noFill();
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
          return (
            hitpos.x > p.pos.x &&
            hitpos.x < p.pos.x + this.w &&
            hitpos.y > p.pos.y &&
            hitpos.y < p.pos.y + this.h
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
          let dx = this.w / 2;
          let dy = this.h / 2;
          let x2 = this.x + this.img.width;
          let y2 = this.y + this.img.height;
          for (let y = this.y; y < y2; y += this.h) {
            for (let x = this.x; x < x2; x += this.w) {
              if (this.shouldSnapToX(p, x, dx, dy, y2)) {
                p.pos.x = x;
              }
              if (this.shouldSnapToY(p, y, dx, dy, x2)) {
                p.pos.y = y;
              }
            }
          }
        }

        private shouldSnapToX(p: Piece, x: number, dx: number, dy: number, y2: number) {
          return this.isOnGrid(p.pos.x, x, dx) && this.isInsideFrame(p.pos.y, this.y, y2 - this.h, dy);
        }

        private shouldSnapToY(p: Piece, y: number, dx: number, dy: number, x2: number) {
          return this.isOnGrid(p.pos.y, y, dy) && this.isInsideFrame(p.pos.x, this.x, x2 - this.w, dx);
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
            let actualIndex =
              (p.pos.x - this.x) / this.w + ((p.pos.y - this.y) / this.h) * this.side;
            if (actualIndex === correctIndex) {
              nrCorrect += 1;
            }
          });
          if (nrCorrect === nrCorrectNeeded) {
            setShowModal(true); // Show modal when the puzzle is complete
            this.canPlay = false;
          } else {
            console.log("Right places: " + nrCorrect);
          }
        }
      }
    };

    const p5Instance = new p5(sketch);

    // Cleanup on component unmount
    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div ref={canvasRef} className="relative w-full h-screen bg-gray-900">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-8 rounded-lg text-center">
            <h1 className="text-4xl font-bold mb-4">Hooray! You have completed the puzzle!</h1>
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
  );
};

export default Puzzle;
