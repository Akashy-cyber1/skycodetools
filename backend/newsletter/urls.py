"""
Newsletter app URL configuration for SkyCode Tools.

This module contains URL patterns for newsletter subscriptions.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsletterSubscriberViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'', NewsletterSubscriberViewSet, basename='subscriber')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
