import { useEffect, useState } from "react";

import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";

import { getSectionsByPage } from "../api/contentSections";
import { getSiteSettings } from "../api/siteSettings";

function Home() {
  const [settings, setSettings] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHome() {
      try {
        const [siteSettings, sectionData] = await Promise.all([
          getSiteSettings(),
          getSectionsByPage("home"),
        ]);

        setSettings(siteSettings);
        setSections(sectionData);
      } catch (error) {
        console.error(error);
        setError("Could not load homepage.");
      } finally {
        setLoading(false);
      }
    }

    fetchHome();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {settings && (
            <>
              <SectionHeader
                title={settings.site_title}
                subtitle={settings.tagline}
              />

              {settings.hero_image && (
                <img
                  src={settings.hero_image}
                  alt={settings.site_title}
                  className="mb-10 max-h-[600px] w-full rounded-lg object-contain"
                />
              )}
            </>
          )}

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
                  className="max-h-96 w-full object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {section.title}
                </h2>

                <p className="mt-4 whitespace-pre-line leading-8 text-gray-700">
                  {section.body}
                </p>
              </div>
            </Card>
          ))}
        </>
      )}
    </main>
  );
}

export default Home;
