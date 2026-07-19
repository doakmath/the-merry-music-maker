import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";

import { getAlbum } from "../api/albums";

function AlbumDetail() {
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlbum(albumId)
      .then((data) => {
        setAlbum(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [albumId]);

  if (loading) {
    return <p>Loading album...</p>;
  }

  return (
    <div>
      <h1>{album.title}</h1>

      <Button variant="primary">
        Play Album
      </Button>

      <h2>Songs</h2>

      {album.songs.map((song) => (
        <div key={song.id}>
          <p>{song.title}</p>
        </div>
      ))}
    </div>
  );
}

export default AlbumDetail;
