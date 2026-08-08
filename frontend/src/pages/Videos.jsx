import { useEffect, useState } from "react";

import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";

import { getVideos } from "../api/videos";

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  const videoId = url.includes("youtu.be/")
    ? url.split("youtu.be/")[1]?.split("?")[0]
    : new URL(url).searchParams.get("v");

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

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

      {!loading && !error && videos.length === 0 && <p>No videos available.</p>}

      <div className="grid gap-8 md:grid-cols-2">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-white">
              <iframe
                src={getYouTubeEmbedUrl(video.video_url)}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-6">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{video.title}</h2>

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

            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}

export default Videos;
