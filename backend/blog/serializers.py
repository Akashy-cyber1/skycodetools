"""
Blog app serializers for SkyCode Tools.

This module contains serializers for blog posts, categories, and tags.
"""
from rest_framework import serializers
from .models import BlogPost, BlogCategory, Tag


class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for the Tag model.
    """
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'created_at']
        read_only_fields = ['id', 'created_at']


class BlogCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the BlogCategory model.
    """
    
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']


class BlogPostSerializer(serializers.ModelSerializer):
    """
    Serializer for the BlogPost model.
    """
    category = BlogCategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image',
            'author', 'author_name', 'category', 'tags', 'status',
            'published_at', 'view_count', 'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'view_count']
    
    def validate_title(self, value):
        """Ensure title is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()
    
    def validate_content(self, value):
        """Ensure content is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Content cannot be empty.")
        return value.strip()
