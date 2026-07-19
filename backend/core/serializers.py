from rest_framework import serializers

from .models import (
    Album,
    Song,
    Video,
    HistoryEvent,
    ContentSection,
    SiteSettings,
    GalleryImage,
)


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = "__all__"


class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = "__all__"


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = "__all__"


class HistoryEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryEvent
        fields = "__all__"


class ContentSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentSection
        fields = "__all__"


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = "__all__"


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = "__all__"
