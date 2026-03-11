"""
Blog app admin configuration for SkyCode Tools.
"""
from django.contrib import admin
from .models import BlogCategory, Tag, BlogPost


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    """
    Admin for BlogCategory model.
    """
    list_display = ('name', 'slug', 'color', 'post_count')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    
    def post_count(self, obj):
        """Show number of posts in this category."""
        return obj.posts.count()
    post_count.short_description = 'Posts'


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """
    Admin for Tag model.
    """
    list_display = ('name', 'slug', 'post_count')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    
    def post_count(self, obj):
        """Show number of posts with this tag."""
        return obj.posts.count()
    post_count.short_description = 'Posts'


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """
    Admin for BlogPost model.
    
    Provides:
    - List view with status and category filtering
    - Search by title/content
    - Preview functionality
    """
    list_display = ('title', 'author', 'category', 'status', 'is_featured', 'published_at', 'view_count')
    list_filter = ('status', 'is_featured', 'category', 'created_at', 'published_at')
    search_fields = ('title', 'excerpt', 'content')
    ordering = ('-published_at',)
    date_hierarchy = 'published_at'
    
    prepopulated_fields = {'slug': ('title',)}
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Categorization', {
            'fields': ('author', 'category', 'tags')
        }),
        ('Publication', {
            'fields': ('status', 'published_at', 'is_featured', 'view_count')
        }),
    )
    
    readonly_fields = ('view_count', 'created_at', 'updated_at')
    
    actions = ['publish_posts', 'archive_posts', 'mark_as_featured']
    
    def publish_posts(self, request, queryset):
        """Publish selected posts."""
        queryset.update(status='published', published_at=timezone.now())
    publish_posts.short_description = 'Publish selected posts'
    
    def archive_posts(self, request, queryset):
        """Archive selected posts."""
        queryset.update(status='archived')
    archive_posts.short_description = 'Archive selected posts'
    
    def mark_as_featured(self, request, queryset):
        """Mark selected posts as featured."""
        queryset.update(is_featured=True)
    mark_as_featured.short_description = 'Mark selected as featured'


# Import timezone for the admin functions
from django.utils import timezone

