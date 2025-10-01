// src/components/ImageModal.tsx
import React from "react";

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full px-2 py-1 shadow hover:bg-gray-200"
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt="Enlarged"
          className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;
