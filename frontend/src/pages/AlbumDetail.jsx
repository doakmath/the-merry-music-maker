import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getAlbum } from "../api/albums";

function AlbumDetail() {
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");

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

  async function handlePurchase() {
    try {
      setPurchasing(true);
      setPurchaseError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/checkout/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            album_id: album.id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error(error);
      setPurchaseError("Unable to start checkout. Please try again.");
      setPurchasing(false);
    }
  }

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
      <section className="grid gap-8 md:grid-cols-[320px_1fr] md:items-center">
        <div className="overflow-hidden rounded-xl bg-gray-200 shadow-lg">
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
          <h1 className="text-4xl font-bold text-gray-900">{album.title}</h1>

          {releaseYear && (
            <p className="mt-2 text-gray-500">Released {releaseYear}</p>
          )}

          {album.description && (
            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-gray-700">
              {album.description}
            </p>
          )}

          {album.is_for_sale && (
            <div className="mt-6 inline-flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <div>
                <p className="font-semibold text-gray-900">
                  Digital Album — ${(album.price_cents / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Download all {album.songs.length} tracks as MP3s
                </p>
              </div>

              <button
                type="button"
                onClick={handlePurchase}
                disabled={purchasing}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {purchasing ? "Opening..." : "Buy Album"}
              </button>
            </div>
          )}

          {purchaseError && (
            <p className="mt-3 text-sm text-red-600">{purchaseError}</p>
          )}
          
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Songs</h2>

          <span className="text-sm text-gray-500">
            {album.songs.length} {album.songs.length === 1 ? "track" : "tracks"}
          </span>
        </div>

        {album.songs.length === 0 ? (
          <p className="mt-4 text-gray-600">
            No songs have been added to this album yet.
          </p>
        ) : (
          <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {album.songs.map((song) => (
              <div
                key={song.id}
                className="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50"
              >
                <span className="w-8 text-gray-500">{song.track_number}</span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900">{song.title}</h3>

                  {song.contributing_artists && (
                    <p className="mt-1 text-sm text-gray-500">
                      {song.contributing_artists}
                    </p>
                  )}
                  {song.audio_file && (
                    <audio
                      controls
                      src={song.audio_file}
                      className="mt-3 w-full"
                    >
                      Your browser does not support audio playback.
                    </audio>
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
