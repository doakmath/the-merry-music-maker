import { useEffect, useState } from "react";
import AlbumCard from "../components/AlbumCard";
import SectionHeader from "../components/ui/SectionHeader";

import { getAlbums } from "../api/albums";

function Music() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const data = await getAlbums();
        setAlbums(data);
      } catch (error) {
        console.error(error);
        setError("Could not load albums.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeader
        title="Music"
        subtitle="Browse albums, discover songs, and explore the music of The Merry Music Maker."
      />

      {loading && <p>Loading albums...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && albums.length === 0 && (
        <p>No albums have been added yet.</p>
      )}

      {!loading && !error && albums.length > 0 && (
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Music;
