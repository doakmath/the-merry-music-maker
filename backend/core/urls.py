from rest_framework.routers import DefaultRouter

from .views import (
    AlbumViewSet,
    SongViewSet,
    VideoViewSet,
    HistoryEventViewSet,
    ContentSectionViewSet,
    SiteSettingsViewSet,
)


router = DefaultRouter()

router.register("albums", AlbumViewSet)
router.register("songs", SongViewSet)
router.register("videos", VideoViewSet)
router.register("history-events", HistoryEventViewSet)
router.register("content-sections", ContentSectionViewSet)
router.register("site-settings", SiteSettingsViewSet)

urlpatterns = router.urls
