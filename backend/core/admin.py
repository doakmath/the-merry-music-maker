from django.contrib import admin

from .models import (
    Album,
    Song,
    Video,
    HistoryEvent,
    ContentSection,
    SiteSettings,
    GalleryImage,
)


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "release_date",
        "is_featured",
        "display_order",
    )


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "album",
        "track_number",
        "is_featured",
    )


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "is_featured",
        "created_at",
    )


@admin.register(HistoryEvent)
class HistoryEventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "date",
        "display_order",
    )


@admin.register(ContentSection)
class ContentSectionAdmin(admin.ModelAdmin):
    list_display = (
        "page",
        "title",
        "display_order",
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "site_title",
        "contact_email",
    )


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "date_taken",
        "is_featured",
        "display_order",
        "created_at",
    )
