import { getData } from "./client";

export function getGalleryImages() {
  return getData("/gallery-images/");
}
