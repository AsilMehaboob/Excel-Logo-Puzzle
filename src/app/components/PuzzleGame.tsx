"use client";
import React, { useState, useEffect } from "react";

const PuzzleGame: React.FC = () => {
  const [piecesArr, setPiecesArr] = useState<(number | null)[]>([]);
  const [placedPiecesArr, setPlacedPiecesArr] = useState<(number | null)[]>(Array(4).fill(null));
  const [movesCount, setMovesCount] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [inputName, setInputName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [draggedPieceInfo, setDraggedPieceInfo] = useState<{ index: number; from: string } | null>(null);

  useEffect(() => {
    if (playerName) {
      randomPieces();
    }
  }, [playerName]);

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const randomPieces = () => {
    const tempArr = Array.from({ length: 4 }, (_, i) => i + 1);
    shuffleArray(tempArr);
    setPiecesArr(tempArr);
  };

  const checkWinCondition = (arr: (number | null)[]) => {
    return arr.join("") === "4321";
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedPieceInfo) {
      const { index: draggedIndex, from } = draggedPieceInfo;
      if (from === "scattered") {
        movePiece(piecesArr, setPiecesArr, placedPiecesArr, setPlacedPiecesArr, draggedIndex, targetIndex);
      } else if (from === "grid") {
        movePiece(placedPiecesArr, setPlacedPiecesArr, placedPiecesArr, setPlacedPiecesArr, draggedIndex, targetIndex);
      }
      setDraggedPieceInfo(null); // Reset after drop
    }
  };

  const movePiece = (
    sourceArray: (number | null)[],
    setSourceArray: React.Dispatch<React.SetStateAction<(number | null)[]>>,
    targetArray: (number | null)[],
    setTargetArray: React.Dispatch<React.SetStateAction<(number | null)[]>>,
    draggedIndex: number,
    targetIndex: number
  ) => {
    const sourcePiece = sourceArray[draggedIndex];
    if (sourcePiece === null) return; // Avoid moving empty spots

    const targetPiece = targetArray[targetIndex];
    const newSourceArray = [...sourceArray];
    const newTargetArray = [...targetArray];

    if (sourceArray === targetArray) {
      // Rearranging within the same section
      newSourceArray[draggedIndex] = targetPiece;
      newSourceArray[targetIndex] = sourcePiece;
      setSourceArray(newSourceArray);
    } else {
      // Moving between sections
      if (targetPiece === null) {
        newSourceArray[draggedIndex] = null;
        newTargetArray[targetIndex] = sourcePiece;
      } else {
        // Swap pieces if the target is already occupied
        newSourceArray[draggedIndex] = targetPiece;
        newTargetArray[targetIndex] = sourcePiece;
      }
      setSourceArray(newSourceArray);
      setTargetArray(newTargetArray);
    }

    setMovesCount(movesCount + 1);

    if (checkWinCondition(newTargetArray)) {
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }
  };

  const handleDragStart = (index: number, from: string) => {
    setDraggedPieceInfo({ index, from });
  };

  const handleTouchStart = (index: number, from: string) => {
    setDraggedPieceInfo({ index, from });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>, targetIndex: number) => {
    handleDrop(targetIndex);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      setPlayerName(inputName);
    }
  };

  const resetGame = () => {
    setMovesCount(0);
    randomPieces();
    setPlacedPiecesArr(Array(4).fill(null));
    setShowModal(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {!playerName ? (
        <form onSubmit={handleNameSubmit} className="text-center">
          <label className="text-white text-lg mb-2 block">Enter your name:</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="px-4 py-2 rounded-lg text-black"
            required
          />
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full">
            Start Game
          </button>
        </form>
      ) : (
        <>
          <div className="relative flex flex-wrap items-center justify-center">
            {/* Scattered Pieces */}
            <div className="flex flex-wrap gap-4 p-4">
              {piecesArr.map((img, index) =>
                img !== null ? (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index, "scattered")}
                    onTouchStart={() => handleTouchStart(index, "scattered")}
                    onTouchEnd={(e) => handleTouchEnd(e, index)}
                    className="border border-white cursor-pointer w-24 h-24"
                  >
                    <img src={`/img_00${img}.png`} className="w-full h-full" alt={`Part ${img}`} />
                  </div>
                ) : (
                  <div key={index} className="w-24 h-24"></div>
                )
              )}
            </div>

            {/* Grid to Place/Rearrange Pieces */}
            <div className="grid grid-cols-2 grid-rows-2 p-4 border border-white bg-black">
              {placedPiecesArr.map((img, index) => (
                <div
                  key={index}
                  draggable={!!img}
                  onDragStart={() => handleDragStart(index, "grid")}
                  onDrop={() => handleDrop(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onTouchStart={() => handleTouchStart(index, "grid")}
                  onTouchEnd={(e) => handleTouchEnd(e, index)}
                  className={`border border-white w-24 h-24 ${!img ? "bg-black" : ""}`}
                >
                  {img && <img src={`/img_00${img}.png`} className="w-full h-full" alt={`Part ${img}`} />}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-lg text-white">Moves: {movesCount}</p>
          <button onClick={resetGame} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full">
            Restart Game
          </button>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Hooray! You have solved it!</h2>
                <p className="text-lg mb-4">{playerName}, you won in {movesCount} moves!</p>
                <button onClick={resetGame} className="bg-blue-500 text-white px-4 py-2 rounded-full">
                  Play Again
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PuzzleGame;
