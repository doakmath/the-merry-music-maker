import { useEffect, useState } from "react";

import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";

import { getSectionsByPage } from "../api/contentSections";
import { getHistoryEvents } from "../api/historyEvents";

function History() {
  const [sections, setSections] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const [sectionData, eventData] = await Promise.all([
          getSectionsByPage("history"),
          getHistoryEvents(),
        ]);

        setSections(sectionData);
        setEvents(eventData);
      } catch (error) {
        console.error(error);
        setError("Could not load history.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <SectionHeader
        title="History"
        subtitle="Explore the story of The Merry Music Maker."
      />

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {sections.map((section) => (
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

          {sections.length === 0 && events.length === 0 && (
            <p>No history content has been added yet.</p>
          )}

          {events.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-8 text-3xl font-semibold">Timeline</h2>

              <div className="space-y-8">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className={`overflow-hidden ${
                      event.image ? "md:grid md:grid-cols-[220px_1fr]" : ""
                    }`}
                  >
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full max-h-72 w-full object-contain"
                      />
                    )}

                    <div className="p-6">
                      {event.date && (
                        <p className="mb-2 text-sm font-semibold text-gray-500">
                          {new Date(
                            `${event.date}T00:00:00`,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}

                      <h3 className="text-2xl font-semibold">{event.title}</h3>

                      <p className="mt-4 whitespace-pre-line leading-8 text-gray-700">
                        {event.body}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default History;
