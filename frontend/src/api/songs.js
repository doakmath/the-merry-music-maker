import { getData } from "./client";

export function getSongs() {
  return getData("/songs/");
}
