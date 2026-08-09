from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import (
    AlbumViewSet,
    SongViewSet,
    VideoViewSet,
    HistoryEventViewSet,
    ContentSectionViewSet,
    SiteSettingsViewSet,
    GalleryImageViewSet,
    create_checkout_session,
    verify_checkout_session,
    stripe_webhook,
)


router = DefaultRouter()

router.register("albums", AlbumViewSet)
router.register("songs", SongViewSet)
router.register("videos", VideoViewSet)
router.register("history-events", HistoryEventViewSet)
router.register("content-sections", ContentSectionViewSet)
router.register("site-settings", SiteSettingsViewSet)
router.register(
    "gallery-images",
    GalleryImageViewSet,
    basename="gallery-image",
)

urlpatterns = [
    path(
        "checkout/create/",
        create_checkout_session,
        name="create-checkout-session",
    ),
    path(
        "checkout/verify/",
        verify_checkout_session,
        name="verify-checkout-session",
    ),
    path(
        "stripe/webhook/",
        stripe_webhook,
        name="stripe-webhook",
    ),
]

urlpatterns += router.urls
