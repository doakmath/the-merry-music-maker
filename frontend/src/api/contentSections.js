import { getData } from "./client";

export function getContentSections() {
  return getData("/content-sections/");
}

export async function getSectionsByPage(page) {
  const sections = await getContentSections();

  return sections.filter((section) => section.page === page);
}
