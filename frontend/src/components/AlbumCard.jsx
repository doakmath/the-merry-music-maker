import { Link } from "react-router-dom";
import Card from "./ui/Card";

function AlbumCard({ album }) {
  return (
    <Link to={`/music/${album.id}`} className="block">
      <Card>
        <div className="aspect-square bg-gray-200">
          {album.cover_image ? (
            <img
              src={album.cover_image}
              alt={`${album.title} album cover`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No cover image
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900">{album.title}</h2>
          {album.release_date && (
            <p className="mt-1 text-sm text-gray-500">
              {new Date(album.release_date).getFullYear()}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default AlbumCard;
