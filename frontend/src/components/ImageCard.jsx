import Card from "./ui/Card";

function ImageCard({ image, onClick }) {
  return (
    <Card
      className="cursor-pointer transition hover:shadow-lg"
      onClick={onClick}
    >
      <img
        src={image.image}
        alt={image.alt_text || image.title}
        className="h-64 w-full object-cover"
      />

      <div className="p-4">
        {image.title && (
          <h2 className="text-xl font-semibold">
            {image.title}
          </h2>
        )}

        {image.caption && (
          <p className="mt-2 text-gray-600">
            {image.caption}
          </p>
        )}
      </div>
    </Card>
  );
}

export default ImageCard;
