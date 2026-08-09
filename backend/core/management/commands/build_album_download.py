import shutil
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand, CommandError
from mutagen.id3 import APIC, ID3, TALB, TIT2, TPE1, TPE2, TRCK

from core.models import Album


ARTIST_NAME = "The Merry Music Maker"


class Command(BaseCommand):
    help = "Build and upload a tagged downloadable ZIP package for an album."

    def add_arguments(self, parser):
        parser.add_argument("album_id", type=int)

    def handle(self, *args, **options):
        album_id = options["album_id"]

        try:
            album = Album.objects.get(id=album_id)
        except Album.DoesNotExist:
            raise CommandError(
                f"Album with ID {album_id} does not exist."
            )

        songs = album.songs.order_by("track_number")

        if not songs.exists():
            raise CommandError(
                f'Album "{album.title}" does not contain any songs.'
            )

        if not album.cover_image:
            raise CommandError(
                f'Album "{album.title}" does not have a cover image.'
            )

        self.stdout.write(f"\nBuilding: {album.title}")
        self.stdout.write(f"Songs: {songs.count()}\n")

        safe_album_title = self.safe_filename(album.title)

        build_root = Path("tmp_album_download")
        album_dir = build_root / safe_album_title

        if album_dir.exists():
            shutil.rmtree(album_dir)

        album_dir.mkdir(parents=True, exist_ok=True)

        # Get album artwork from R2.
        with album.cover_image.open("rb") as cover_source:
            cover_data = cover_source.read()

        # Save artwork as a standalone file in the package.
        cover_path = album_dir / "cover.jpeg"

        with open(cover_path, "wb") as cover_file:
            cover_file.write(cover_data)

        self.stdout.write(
            self.style.SUCCESS("Saved album cover: cover.jpeg")
        )

        total_tracks = songs.count()

        # Build tagged downloadable MP3 copies.
        for song in songs:
            if not song.audio_file:
                self.stdout.write(
                    self.style.WARNING(
                        f"Skipping {song.title}: no audio file."
                    )
                )
                continue

            track_number = song.track_number or 0

            filename = (
                f"{track_number:02d} - "
                f"{self.safe_filename(song.title)}.mp3"
            )

            output_path = album_dir / filename

            # Copy source MP3 from R2.
            with song.audio_file.open("rb") as source:
                with open(output_path, "wb") as destination:
                    shutil.copyfileobj(source, destination)

            tags = ID3()

            tags.add(
                TIT2(
                    encoding=3,
                    text=song.title,
                )
            )

            tags.add(
                TPE1(
                    encoding=3,
                    text=ARTIST_NAME,
                )
            )

            tags.add(
                TPE2(
                    encoding=3,
                    text=ARTIST_NAME,
                )
            )

            tags.add(
                TALB(
                    encoding=3,
                    text=album.title,
                )
            )

            tags.add(
                TRCK(
                    encoding=3,
                    text=f"{track_number}/{total_tracks}",
                )
            )

            tags.add(
                APIC(
                    encoding=3,
                    mime="image/jpeg",
                    type=3,
                    desc="Cover",
                    data=cover_data,
                )
            )

            tags.save(output_path)

            self.stdout.write(
                self.style.SUCCESS(
                    f"Tagged + artwork: {filename}"
                )
            )

        # Build the ZIP.
        zip_base = build_root / safe_album_title

        zip_path = Path(
            shutil.make_archive(
                str(zip_base),
                "zip",
                root_dir=album_dir,
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nZIP created:\n{zip_path.resolve()}"
            )
        )

        # Replace the album's previous downloadable package, if one exists.
        if album.download_file:
            album.download_file.delete(save=False)

        # Upload ZIP through Django storage.
        # Because default storage is R2, this goes directly to Cloudflare.
        with open(zip_path, "rb") as zip_file:
            album.download_file.save(
                f"{safe_album_title}.zip",
                File(zip_file),
                save=True,
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nUploaded to R2:\n{album.download_file.name}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "\nAlbum download package is ready."
            )
        )

    @staticmethod
    def safe_filename(value):
        """
        Remove characters that can cause problems in filenames.
        """
        invalid_characters = '<>:"/\\|?*'

        for character in invalid_characters:
            value = value.replace(character, "")

        return value.strip()
