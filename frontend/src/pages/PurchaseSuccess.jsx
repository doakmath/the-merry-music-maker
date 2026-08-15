import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { API_BASE_URL } from "../api/client";

function PurchaseSuccess() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [album, setAlbum] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    async function verifyPurchase() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/checkout/verify/?session_id=${encodeURIComponent(
            sessionId,
          )}`,
        );

        if (!response.ok) {
          throw new Error("Purchase verification failed.");
        }

        const data = await response.json();

        setAlbum(data);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    }

    verifyPurchase();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <p>Verifying your purchase...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold">Unable to verify purchase</h1>

        <p className="mt-4">We couldn't confirm a completed payment.</p>

        <Link to="/music" className="mt-6 underline">
          Return to Music
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold">Thank You!</h1>

      <p className="mt-4">
        Your purchase of <strong>{album.album_title}</strong> was successful.
      </p>

      <p className="mt-2">Your album download is ready.</p>

      <a
        href={album.download_url}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Download {album.album_title}
      </a>

      <Link to="/music" className="mt-8 underline">
        Return to Music
      </Link>
    </main>
  );
}

export default PurchaseSuccess;
