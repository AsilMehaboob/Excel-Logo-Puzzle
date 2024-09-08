import React from "react";

interface ModalProps {
  showModal: boolean;
  elapsedTime: string;
}

const Modal: React.FC<ModalProps> = ({ showModal, elapsedTime }) => {
  if (!showModal) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Puzzle Completed!</h2>
        <p className="mb-4">
          Puzzle complete! You've seen the past—now get ready, because our new logo is about to be revealed!
        </p>
        <p className="text-lg">Time taken: {elapsedTime}</p>
      </div>
    </div>
  );
};

export default Modal;
