import { getData } from "./client";

export function getVideos() {
  return getData("/videos/");
}
