import { useEffect, useState } from "react";

import ImageCard from "../components/ImageCard";
import ImageModal from "../components/ImageModal";
import SectionHeader from "../components/ui/SectionHeader";

function Gallery() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/gallery-images/"
        );

        if (!response.ok) {
          throw new Error("Could not load gallery images.");
        }

        const data = await response.json();
        setImages(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeader
        title="Gallery"
        subtitle="Photos from performances, events, and moments through the years."
      />

      {isLoading && <p>Loading gallery...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && images.length === 0 && (
        <p>No gallery images have been added yet.</p>
      )}

      {!isLoading && !error && images.length > 0 && (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </section>
      )}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </main>
  );
}

export default Gallery;
