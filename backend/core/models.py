from django.db import models


class SiteSettings(models.Model):
    site_title = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300, blank=True)
    hero_image = models.ImageField(upload_to="site/", blank=True, null=True)

    youtube_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    contact_email = models.EmailField(blank=True)

    def __str__(self):
        return self.site_title


class Album(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    cover_image = models.ImageField(upload_to="albums/", blank=True, null=True)

    release_date = models.DateField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title


class Song(models.Model):
    album = models.ForeignKey(
        Album,
        related_name="songs",
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)
    lyrics = models.TextField(blank=True)

    contributing_artists = models.TextField(blank=True)

    track_number = models.PositiveIntegerField(blank=True, null=True)

    audio_file = models.FileField(upload_to="songs/", blank=True, null=True)
    cover_image = models.ImageField(upload_to="songs/images/", blank=True, null=True)

    youtube_url = models.URLField(blank=True)
    spotify_url = models.URLField(blank=True)

    release_date = models.DateField(blank=True, null=True)

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title


class Video(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    video_url = models.URLField()
    thumbnail = models.ImageField(upload_to="videos/", blank=True, null=True)

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title


class HistoryEvent(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()

    date = models.DateField(blank=True, null=True)

    image = models.ImageField(upload_to="history/", blank=True, null=True)

    display_order = models.PositiveIntegerField(default=0)


    def __str__(self):
        return self.title


class ContentSection(models.Model):
    PAGE_CHOICES = [
        ("home", "Home"),
        ("bio", "Bio"),
        ("history", "History"),
        ("other", "Other"),
    ]

    page = models.CharField(
        max_length=50,
        choices=PAGE_CHOICES
    )

    title = models.CharField(max_length=200)
    body = models.TextField()

    image = models.ImageField(upload_to="content/", blank=True, null=True)

    display_order = models.PositiveIntegerField(default=0)


    def __str__(self):
        return f"{self.page} - {self.title}"


class GalleryImage(models.Model):
    image = models.ImageField(upload_to="gallery/")

    title = models.CharField(max_length=200, blank=True)
    caption = models.TextField(blank=True)
    alt_text = models.CharField(max_length=300, blank=True)

    date_taken = models.DateField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or self.image.name
