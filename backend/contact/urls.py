"""
Contact app URL configuration for SkyCode Tools.

This module contains URL patterns for contact form submissions.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactSubmissionViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'', ContactSubmissionViewSet, basename='contact')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
