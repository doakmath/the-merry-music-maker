import { getData } from "./client";

export async function getSiteSettings() {
  const settings = await getData("/site-settings/");
  return settings[0] ?? null;
}
