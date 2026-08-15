from django.shortcuts import render

from rest_framework import viewsets

import os
import stripe

from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .models import (
    Album,
    Song,
    Video,
    HistoryEvent,
    ContentSection,
    SiteSettings,
    GalleryImage,
    Purchase,
)

from .serializers import (
    AlbumSerializer,
    SongSerializer,
    VideoSerializer,
    HistoryEventSerializer,
    ContentSectionSerializer,
    SiteSettingsSerializer,
    GalleryImageSerializer,
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


class GalleryImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryImage.objects.all().order_by(
        "display_order",
        "title",
    )
    serializer_class = GalleryImageSerializer




stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


@api_view(["POST"])
def create_checkout_session(request):
    album_id = request.data.get("album_id")

    try:
        album = Album.objects.get(id=album_id)
    except Album.DoesNotExist:
        return Response(
            {"error": "Album not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if not album.is_for_sale:
        return Response(
            {"error": "This album is not currently for sale."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not album.download_file:
        return Response(
            {"error": "This album does not have a download package."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        session = stripe.checkout.Session.create(
            mode="payment",

            managed_payments={
                "enabled": False,
            },

            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": album.price_cents,
                        "product_data": {
                            "name": album.title,
                            "description": "Digital album download",
                        },
                    },
                    "quantity": 1,
                }
            ],

            metadata={
                "album_id": str(album.id),
            },

            success_url=(
                f"{settings.FRONTEND_URL}/purchase-success"
                "?session_id={CHECKOUT_SESSION_ID}"
            ),

            cancel_url=f"{settings.FRONTEND_URL}/music",
                )

        return Response(
            {
                "checkout_url": session.url,
            }
        )

    except stripe.StripeError:
        return Response(
            {"error": "Unable to create checkout session."},
            status=status.HTTP_502_BAD_GATEWAY,
        )


@api_view(["GET"])
def verify_checkout_session(request):
    session_id = request.query_params.get("session_id")

    if not session_id:
        return Response(
            {"error": "Missing session_id."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except stripe.StripeError:
        return Response(
            {"error": "Unable to verify checkout session."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if session.payment_status != "paid":
        return Response(
            {"error": "Payment has not been completed."},
            status=status.HTTP_402_PAYMENT_REQUIRED,
        )

    album_id = session.metadata["album_id"]

    try:
        album = Album.objects.get(id=album_id)
    except Album.DoesNotExist:
        return Response(
            {"error": "Album not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if not album.download_file:
        return Response(
            {"error": "Album download is unavailable."},
            status=status.HTTP_404_NOT_FOUND,
        )

    download_url = album.download_file.storage.url(
        album.download_file.name,
        expire=300,
    )

    return Response(
        {
            "paid": True,
            "album_id": album.id,
            "album_title": album.title,
            "download_url": download_url,
        }
    )


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            webhook_secret,
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.SignatureVerificationError:
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        if session["payment_status"] != "paid":
            return HttpResponse(status=200)

        try:
            album_id = session["metadata"]["album_id"]
        except (KeyError, TypeError):
            album_id = None

        if album_id:
            try:
                album = Album.objects.get(id=album_id)
            except Album.DoesNotExist:
                return HttpResponse(status=200)

            customer_details = session["customer_details"]
            customer_email = (
                customer_details["email"]
                if customer_details
                else None
            )

            Purchase.objects.get_or_create(
                stripe_session_id=session["id"],
                defaults={
                    "album": album,
                    "customer_email": customer_email,
                    "amount_paid": session["amount_total"],
                },
            )

            print(
                f"Stripe purchase recorded for album ID {album_id}"
            )

    return HttpResponse(status=200)
