"use client";
import React, { useState } from "react";

const PuzzleGame: React.FC = () => {
  const [imagesArr, setImagesArr] = useState<number[]>([]);
  const [movesCount, setMovesCount] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [inputName, setInputName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const randomImages = () => {
    const tempArr = Array.from({ length: 8 }, (_, i) => i + 1);
    shuffleArray(tempArr);
    tempArr.push(9); // The 9 represents the empty space
    setImagesArr(tempArr);
  };

  const getCoords = (index: number): [number, number] => {
    return [Math.floor(index / 3), index % 3];
  };

  const checkAdjacent = (index1: number, index2: number): boolean => {
    const [row1, col1] = getCoords(index1);
    const [row2, col2] = getCoords(index2);

    if (row1 === row2) {
      return col2 === col1 - 1 || col2 === col1 + 1;
    } else if (col1 === col2) {
      return row2 === row1 - 1 || row2 === row1 + 1;
    }
    return false;
  };

  const handleClick = (index: number) => {
    const emptyIndex = imagesArr.indexOf(9);

    if (checkAdjacent(index, emptyIndex)) {
      const newArr = [...imagesArr];
      [newArr[index], newArr[emptyIndex]] = [newArr[emptyIndex], newArr[index]];

      setImagesArr(newArr);
      setMovesCount(movesCount + 1);

      // Check win condition
      if (newArr.join('') === '123456789') {
        setTimeout(() => {
          setShowModal(true);
        }, 500);
      }
    }
  };

  const resetGame = () => {
    setMovesCount(0);
    randomImages();
    setShowModal(false);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Player Name Submitted:", inputName); // Debugging to ensure the name is captured
    if (inputName.trim()) {
      setPlayerName(inputName); // Set the player name state
      randomImages(); // Initialize the game
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-black">
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
          <div className="container grid grid-cols-3 grid-rows-3 gap-2 w-64 h-64">
            {imagesArr.map((img, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className="border border-white cursor-pointer image-container"
              >
                {img !== 9 ? (
                  <img
                    src={`/image_part_00${img}.png`}
                    className="w-full h-full"
                    alt={`Part ${img}`}
                  />
                ) : (
                  <div className="w-full h-full bg-black"></div>
                )}
              </div>
            ))}
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
                <h2 className="text-2xl font-bold mb-4">Hooray!</h2>
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
