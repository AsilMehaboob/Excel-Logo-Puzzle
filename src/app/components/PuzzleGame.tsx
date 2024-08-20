"use client";
import React, { useState, useEffect } from "react";

const PuzzleGame: React.FC = () => {
  // Allow nulls in the arrays
  const [piecesArr, setPiecesArr] = useState<(number | null)[]>([]);
  const [placedPiecesArr, setPlacedPiecesArr] = useState<(number | null)[]>(Array(4).fill(null));
  const [movesCount, setMovesCount] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [inputName, setInputName] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    console.log("Checking win condition:", arr.join(""));
    return arr.join("") === "4321";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
    const draggedFromScattered = e.dataTransfer.getData("from") === "scattered";
    const newArr = [...placedPiecesArr];

    if (draggedFromScattered) {
      const draggedPiece = piecesArr[draggedIndex];
      if (!newArr[targetIndex]) {
        newArr[targetIndex] = draggedPiece;
        const updatedPiecesArr = [...piecesArr];
        updatedPiecesArr[draggedIndex] = null;

        setPiecesArr(updatedPiecesArr);
        setPlacedPiecesArr(newArr);
        setMovesCount(movesCount + 1);
      }
    } else {
      const targetPiece = newArr[targetIndex];
      newArr[targetIndex] = newArr[draggedIndex];
      newArr[draggedIndex] = targetPiece;
      setPlacedPiecesArr(newArr);
      setMovesCount(movesCount + 1);
    }

    console.log("Placed pieces array after drop:", newArr);

    // Check win condition
    if (checkWinCondition(newArr)) {
      console.log("Win condition met!");
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number, from: string) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.setData("from", from);
  };

  const handleScatteredDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
    const draggedFromGrid = e.dataTransfer.getData("from") === "grid";
    const newArr = [...piecesArr];

    if (draggedFromGrid) {
      const draggedPiece = placedPiecesArr[draggedIndex];
      if (!newArr[targetIndex]) {
        newArr[targetIndex] = draggedPiece;
        const updatedPlacedArr = [...placedPiecesArr];
        updatedPlacedArr[draggedIndex] = null;

        setPiecesArr(newArr);
        setPlacedPiecesArr(updatedPlacedArr);
        setMovesCount(movesCount + 1);
      }
    }
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
          <label className="text-white text-lg mb-2 block">
            Enter your name:
          </label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="px-4 py-2 rounded-lg text-black"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full"
          >
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
                    onDragStart={(e) => handleDragStart(e, index, "scattered")}
                    onDrop={(e) => handleScatteredDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    className="border border-white cursor-pointer w-24 h-24"
                  >
                    <img
                      src={`/img_00${img}.png`}
                      className="w-full h-full"
                      alt={`Part ${img}`}
                    />
                  </div>
                ) : (
                  <div key={index} className="w-24 h-24"></div>
                )
              )}
            </div>

            {/* Grid to Place Pieces */}
            <div className="grid grid-cols-2 grid-rows-2 p-4 border border-white bg-black">
              {placedPiecesArr.map((img, index) => (
                <div
                  key={index}
                  draggable={!!img}
                  onDragStart={(e) => handleDragStart(e, index, "grid")}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  className={`border border-white w-24 h-24 ${!img ? 'bg-black' : ''}`}
                >
                  {img && (
                    <img
                      src={`/img_00${img}.png`}
                      className="w-full h-full"
                      alt={`Part ${img}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-lg text-white">Moves: {movesCount}</p>
          <button
            onClick={resetGame}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Restart Game
          </button>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Hooray! You have solved it!</h2>
                <p className="text-lg mb-4">
                  {playerName}, you won in {movesCount} moves!
                </p>
                <button
                  onClick={resetGame}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full"
                >
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
