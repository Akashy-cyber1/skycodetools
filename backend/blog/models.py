"""
Blog app models for SkyCode Tools.

This module contains models for blog posts, categories, and tags.
"""
from django.db import models
from django.utils import timezone
from core.models import TimestampableModel


class BlogCategory(TimestampableModel):
    """
    Model for organizing blog posts into categories.
    """
    
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Category name"
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        help_text="URL-friendly category name"
    )
    description = models.TextField(
        blank=True,
        default='',
        help_text="Category description"
    )
    color = models.CharField(
        max_length=7,
        default='#3B82F6',
        help_text="Hex color code for display"
    )
    
    class Meta:
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Tag(TimestampableModel):
    """
    Model for tagging blog posts.
    """
    
    name = models.CharField(
        max_length=50,
        unique=True,
        help_text="Tag name"
    )
    slug = models.SlugField(
        max_length=55,
        unique=True,
        help_text="URL-friendly tag name"
    )
    
    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class BlogPost(TimestampableModel):
    """
    Model for blog posts.
    
    Supports draft/published/archived workflow with
    publishing date tracking.
    """
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(
        max_length=300,
        help_text="Post title"
    )
    slug = models.SlugField(
        max_length=320,
        unique=True,
        help_text="URL-friendly post title"
    )
    excerpt = models.TextField(
        max_length=500,
        help_text="Short summary for previews"
    )
    content = models.TextField(
        help_text="Full post content"
    )
    featured_image = models.ImageField(
        upload_to='blog/featured/',
        null=True,
        blank=True,
        help_text="Featured image URL"
    )
    author = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='blog_posts',
        help_text="Post author"
    )
    category = models.ForeignKey(
        'BlogCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts',
        help_text="Post category"
    )
    tags = models.ManyToManyField(
        'Tag',
        blank=True,
        related_name='posts',
        help_text="Post tags"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        help_text="Post status"
    )
    published_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the post was published"
    )
    view_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of views"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Feature this post on the homepage"
    )
    seo = models.JSONField(
        default=dict,
        blank=True,
        help_text="SEO metadata: {'metaTitle': str, 'metaDescription': str}"
    )
    
    class Meta:
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['category', '-published_at']),
        ]
    
    def __str__(self):
        return self.title
    
    def publish(self):
        """Publish this post."""
        self.status = 'published'
        self.published_at = timezone.now()
        self.save(update_fields=['status', 'published_at'])
    
    def archive(self):
        """Archive this post."""
        self.status = 'archived'
        self.save(update_fields=['status'])

