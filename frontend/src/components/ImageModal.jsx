import { useEffect } from "react";

function ImageModal({ image, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-lg bg-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-2xl text-white hover:bg-black"
          aria-label="Close image"
        >
          ×
        </button>

        <img
          src={image.image}
          alt={image.alt_text || image.title || "Gallery image"}
          className="max-h-[75vh] w-full object-contain"
        />

        {(image.title || image.caption) && (
          <div className="p-5">
            {image.title && (
              <h2 className="text-2xl font-semibold">
                {image.title}
              </h2>
            )}

            {image.caption && (
              <p className="mt-2 text-gray-600">
                {image.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageModal;
