import { useEffect, useState } from "react";

import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";

import { getVideos } from "../api/videos";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVideos() {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error(error);
        setError("Could not load videos.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SectionHeader
        title="Videos"
        subtitle="Performances, recordings, and other video content."
      />

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && videos.length === 0 && (
        <p>No videos available.</p>
      )}

      {videos.map((video) => (
        <Card key={video.id} className="mb-8 overflow-hidden">
          <a
            href={video.video_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.thumbnail && (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-64 w-full object-cover transition duration-300 hover:scale-105"
              />
            )}
          </a>

          <div className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-2xl font-semibold">
                {video.title}
              </h2>

              {video.is_featured && (
                <span className="rounded bg-yellow-200 px-2 py-1 text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>

            {video.description && (
              <p className="mb-6 whitespace-pre-line text-gray-700">
                {video.description}
              </p>
            )}

            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              Watch Video →
            </a>
          </div>
        </Card>
      ))}
    </main>
  );
}

export default Videos;
