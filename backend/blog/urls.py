"""
Blog app URL configuration for SkyCode Tools.

This module contains URL patterns for blog posts, categories, and tags.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, BlogCategoryViewSet, TagViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='blogpost')
router.register(r'categories', BlogCategoryViewSet, basename='blogcategory')
router.register(r'tags', TagViewSet, basename='tag')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
