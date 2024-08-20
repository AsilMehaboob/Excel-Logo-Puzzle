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
      setDraggedPieceInfo(null);
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
    if (sourcePiece === null) return;

    const targetPiece = targetArray[targetIndex];
    const newSourceArray = [...sourceArray];
    const newTargetArray = [...targetArray];

    if (sourceArray === targetArray) {
      newSourceArray[draggedIndex] = targetPiece;
      newSourceArray[targetIndex] = sourcePiece;
      setSourceArray(newSourceArray);
    } else {
      if (targetPiece === null) {
        newSourceArray[draggedIndex] = null;
        newTargetArray[targetIndex] = sourcePiece;
      } else {
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

  const handleTouchStart = (index: number, from: string, e: React.TouchEvent<HTMLDivElement>) => {
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
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      {!playerName ? (
        <form onSubmit={handleNameSubmit} className="text-center">
          <label className="text-white text-lg mb-4 block">Enter your name:</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="px-4 py-2 rounded-lg text-black w-full max-w-xs"
            required
          />
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full w-full max-w-xs">
            Start Game
          </button>
        </form>
      ) : (
        <>
          <div className="flex flex-col items-center w-full max-w-lg">
            {/* Scattered Pieces */}
            <div className="flex flex-wrap gap-4 p-4 justify-center">
              {piecesArr.map((img, index) =>
                img !== null ? (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index, "scattered")}
                    onTouchStart={(e) => handleTouchStart(index, "scattered", e)}
                    onTouchEnd={(e) => handleTouchEnd(e, index)}
                    className="border border-white cursor-pointer w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-700"
                  >
                    <img src={`/img_00${img}.png`} className="w-full h-full rounded-lg" alt={`Part ${img}`} />
                  </div>
                ) : (
                  <div key={index} className="w-20 h-20 md:w-24 md:h-24"></div>
                )
              )}
            </div>

            {/* Grid to Place/Rearrange Pieces */}
            <div className="grid grid-cols-2 grid-rows-2 gap-2 p-4 border border-white rounded-lg bg-black">
              {placedPiecesArr.map((img, index) => (
                <div
                  key={index}
                  draggable={!!img}
                  onDragStart={() => handleDragStart(index, "grid")}
                  onDrop={() => handleDrop(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onTouchStart={(e) => handleTouchStart(index, "grid", e)}
                  onTouchEnd={(e) => handleTouchEnd(e, index)}
                  className={`border border-white w-20 h-20 md:w-24 md:h-24 rounded-lg ${!img ? "bg-gray-600" : ""}`}
                >
                  {img && <img src={`/img_00${img}.png`} className="w-full h-full rounded-lg" alt={`Part ${img}`} />}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-lg text-white">Moves: {movesCount}</p>
          <button onClick={resetGame} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full w-full max-w-xs">
            Restart Game
          </button>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg text-center max-w-xs w-full">
                <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
                <p className="text-lg mb-4">{playerName}, you won in {movesCount} moves!</p>
                <button onClick={resetGame} className="bg-blue-500 text-white px-4 py-2 rounded-full w-full">
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
