import { useEffect, useState } from "react";
import AlbumCard from "../components/AlbumCard";

import { getAlbums } from "../api/albums";

function Music() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlbums()
      .then((data) => {
        setAlbums(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading albums...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-4xl font-bold">Music</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}

export default Music;
