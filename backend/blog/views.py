"""
Blog app views for SkyCode Tools.

This module contains views and viewsets for blog posts, categories, and tags.
"""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.utils import timezone
from .models import BlogPost, BlogCategory, Tag
from .serializers import BlogPostSerializer, BlogCategorySerializer, TagSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the BlogPost model.
    
    Provides complete CRUD operations:
    - list: GET /blog/ - Retrieve all published blog posts
    - create: POST /blog/ - Create a new blog post
    - retrieve: GET /blog/{id}/ - Retrieve a specific blog post
    - update: PUT /blog/{id}/ - Update a specific blog post
    - partial_update: PATCH /blog/{id}/ - Partially update a specific blog post
    - destroy: DELETE /blog/{id}/ - Delete a specific blog post
    
    Only published posts are returned in list view by default.
    """
    
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Filter queryset based on request parameters."""
        queryset = BlogPost.objects.all()
        
        # Filter by status - only show published posts for public API
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        elif self.action == 'list':
            # Only show published posts for list action (public access)
            queryset = queryset.filter(status='published', published_at__lte=timezone.now())
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by tag
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        
        # Filter featured posts
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        return queryset.select_related('author', 'category').prefetch_related('tags')
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count when retrieving a post."""
        instance = self.get_object()
        # Only increment view count for published posts
        if instance.status == 'published':
            instance.view_count += 1
            instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        """Set the author when creating a new post."""
        serializer.save(author=self.request.user if self.request.user.is_authenticated else None)
    
    def create(self, request, *args, **kwargs):
        """Handle post creation with validation."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the BlogCategory model.
    
    Provides complete CRUD operations for blog categories.
    """
    
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'


class TagViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Tag model.
    
    Provides complete CRUD operations for tags.
    """
    
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
