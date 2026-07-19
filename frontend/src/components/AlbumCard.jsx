import { Link } from "react-router-dom";
import Card from "./ui/Card";


function AlbumCard({ album }) {
  return (
    <Link
      to={`/music/${album.id}`}
      className="block"
    >
      <Card>
        <div className="aspect-square bg-gray-200">
          {album.cover_image ? (
            <img
              src={album.cover_image}
              alt={`${album.title} album cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No cover image
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {album.title}
          </h2>
        </div>
      </Card>
    </Link>
  );
}

export default AlbumCard;
