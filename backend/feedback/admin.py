"""
Feedback app admin configuration for SkyCode Tools.
"""
from django.contrib import admin
from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    """
    Admin configuration for Feedback model.
    
    Provides:
    - List view with type and status filtering
    - Search by title/description
    - Link to related tool
    """
    list_display = ('title', 'feedback_type', 'tool', 'status', 'created_at')
    list_filter = ('feedback_type', 'status', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Feedback Information', {
            'fields': ('feedback_type', 'title', 'description', 'tool')
        }),
        ('Status & Metadata', {
            'fields': ('status', 'ip_address', 'attachments'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('ip_address', 'created_at', 'updated_at')
    
    actions = ['mark_as_spam', 'mark_as_reviewed', 'mark_as_planned', 'mark_as_implemented']
    
    def mark_as_spam(self, request, queryset):
        """Mark selected feedback as spam."""
        queryset.update(status='spam')
    mark_as_spam.short_description = 'Mark selected as spam'
    
    def mark_as_reviewed(self, request, queryset):
        """Mark selected feedback as reviewed."""
        queryset.update(status='reviewed')
    mark_as_reviewed.short_description = 'Mark selected as reviewed'
    
    def mark_as_planned(self, request, queryset):
        """Mark selected feedback as planned."""
        queryset.update(status='planned')
    mark_as_planned.short_description = 'Mark selected as planned'
    
    def mark_as_implemented(self, request, queryset):
        """Mark selected feedback as implemented."""
        queryset.update(status='implemented')
    mark_as_implemented.short_description = 'Mark selected as implemented'

