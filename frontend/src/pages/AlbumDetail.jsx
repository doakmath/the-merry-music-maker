import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getAlbum } from "../api/albums";

function AlbumDetail() {
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const data = await getAlbum(albumId);
        setAlbum(data);
      } catch (error) {
        console.error(error);
        setError("Could not load this album.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbum();
  }, [albumId]);

  if (loading) {
    return <p>Loading album...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!album) {
    return <p>Album not found.</p>;
  }

  const releaseYear = album.release_date
    ? new Date(album.release_date).getFullYear()
    : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="grid gap-8 md:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-xl bg-gray-200 shadow-sm">
          {album.cover_image ? (
            <img
              src={album.cover_image}
              alt={`${album.title} album cover`}
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-gray-500">
              No cover image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {album.title}
          </h1>

          {releaseYear && (
            <p className="mt-2 text-gray-500">
              Released {releaseYear}
            </p>
          )}

          {album.description && (
            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-gray-700">
              {album.description}
            </p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          Songs
        </h2>

        {album.songs.length === 0 ? (
          <p className="mt-4 text-gray-600">
            No songs have been added to this album yet.
          </p>
        ) : (
          <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {album.songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-4"
              >
                <span className="w-8 text-gray-500">
                  {song.track_number}
                </span>

                <div>
                  <h3 className="font-medium text-gray-900">
                    {song.title}
                  </h3>

                  {song.contributing_artists && (
                    <p className="mt-1 text-sm text-gray-500">
                      {song.contributing_artists}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AlbumDetail;
