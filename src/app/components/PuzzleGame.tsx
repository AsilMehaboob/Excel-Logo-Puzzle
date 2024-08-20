"use client";
import React, { useState, useEffect } from "react";

const PuzzleGame: React.FC = () => {
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
    return arr.join("") === "4321";
  };

  const handleDrop = (targetIndex: number, draggedIndex: number, from: string) => {
    const newArr = [...placedPiecesArr];

    if (from === "scattered") {
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

    if (checkWinCondition(newArr)) {
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    index: number,
    from: string
  ) => {
    if (e.type === "dragstart") {
      (e as React.DragEvent).dataTransfer.setData("text/plain", index.toString());
      (e as React.DragEvent).dataTransfer.setData("from", from);
    } else {
      const touch = (e as React.TouchEvent).touches[0];
      const data = JSON.stringify({ index, from });
      (e.target as HTMLElement).setAttribute("data-drag", data);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    const dragData = (e.target as HTMLElement).getAttribute("data-drag");

    if (element && dragData) {
      const { index, from } = JSON.parse(dragData);
      element.addEventListener(
        "touchend",
        () => {
          if (element.getAttribute("data-drop-index")) {
            const targetIndex = parseInt(element.getAttribute("data-drop-index") || "0", 10);
            handleDrop(targetIndex, index, from);
          }
        },
        { once: true }
      );
    }
  };

  const handleDropEvent = (
    e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    if (e.type === "drop") {
      const draggedIndex = Number((e as React.DragEvent).dataTransfer.getData("text/plain"));
      const draggedFrom = (e as React.DragEvent).dataTransfer.getData("from");
      handleDrop(targetIndex, draggedIndex, draggedFrom);
    } else {
      const dragData = (e.target as HTMLElement).getAttribute("data-drag");
      if (dragData) {
        const { index, from } = JSON.parse(dragData);
        handleDrop(targetIndex, index, from);
      }
    }
  };

  const handleScatteredDrop = (
    e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    const draggedIndex = e.type === "drop"
      ? Number((e as React.DragEvent).dataTransfer.getData("text/plain"))
      : Number(JSON.parse((e.target as HTMLElement).getAttribute("data-drag") || "{}").index);
    const draggedFrom = e.type === "drop"
      ? (e as React.DragEvent).dataTransfer.getData("from")
      : JSON.parse((e.target as HTMLElement).getAttribute("data-drag") || "{}").from;
    const newArr = [...piecesArr];

    if (draggedFrom === "grid") {
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
                    onTouchStart={(e) => handleDragStart(e, index, "scattered")}
                    onTouchMove={handleTouchMove}
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
                  onTouchStart={(e) => handleDragStart(e, index, "grid")}
                  onTouchMove={handleTouchMove}
                  onDrop={(e) => handleDropEvent(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  className={`border border-white w-24 h-24 ${!img ? 'bg-black' : ''}`}
                  data-drop-index={index}
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
                <h2 className="text-2xl font-bold mb-4">Hooray! You have solveddd it!</h2>
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
