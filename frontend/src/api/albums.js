import { getData } from "./client";

export function getAlbums() {
  return getData("/albums/");
}

export function getAlbum(id) {
  return getData(`/albums/${id}/`);
}
