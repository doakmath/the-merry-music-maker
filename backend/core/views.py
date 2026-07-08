from django.shortcuts import render

from rest_framework import viewsets

from .models import (
    Album,
    Song,
    Video,
    HistoryEvent,
    ContentSection,
    SiteSettings,
)

from .serializers import (
    AlbumSerializer,
    SongSerializer,
    VideoSerializer,
    HistoryEventSerializer,
    ContentSectionSerializer,
    SiteSettingsSerializer,
)


class AlbumViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Album.objects.all().order_by("display_order", "title")
    serializer_class = AlbumSerializer


class SongViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Song.objects.all().order_by("album", "track_number", "title")
    serializer_class = SongSerializer


class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Video.objects.all().order_by("-created_at")
    serializer_class = VideoSerializer


class HistoryEventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HistoryEvent.objects.all().order_by("display_order", "date")
    serializer_class = HistoryEventSerializer


class ContentSectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ContentSection.objects.all().order_by("page", "display_order")
    serializer_class = ContentSectionSerializer


class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
