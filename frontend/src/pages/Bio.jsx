import { useEffect, useState } from "react";

import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";

import { getSectionsByPage } from "../api/contentSections";

function Bio() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSections() {
      try {
        const data = await getSectionsByPage("bio");
        setSections(data);
      } catch (error) {
        console.error(error);
        setError("Could not load bio.");
      } finally {
        setLoading(false);
      }
    }

    fetchSections();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SectionHeader
        title="Bio"
        subtitle="Learn more about The Merry Music Maker."
      />

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && sections.length === 0 && (
        <p>No bio content has been added yet.</p>
      )}

      {!loading &&
        !error &&
        sections.map((section) => (
          <Card
            key={section.id}
            className={`mb-8 overflow-hidden ${
              section.image
                ? "md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                : ""
            }`}
          >
            {section.image && (
              <img
                src={section.image}
                alt={section.title}
                className="h-full w-full object-contain"
              />
            )}

            <div className="p-6">
              <h2 className="text-2xl font-semibold">{section.title}</h2>

              <p className="mt-4 whitespace-pre-line leading-8 text-gray-700">
                {section.body}
              </p>
            </div>
          </Card>
        ))}
    </main>
  );
}

export default Bio;
