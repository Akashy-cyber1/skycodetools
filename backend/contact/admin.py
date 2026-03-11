"""
Contact app admin configuration for SkyCode Tools.
"""
from django.contrib import admin
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    """
    Admin configuration for ContactSubmission model.
    
    Provides:
    - List view with status filtering
    - Search by name/email/subject
    - Mark as spam action
    """
    list_display = ('name', 'email', 'subject', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'subject', 'message')
        }),
        ('Status & Metadata', {
            'fields': ('status', 'ip_address', 'user_agent', 'notes'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('ip_address', 'user_agent', 'created_at', 'updated_at')
    
    actions = ['mark_as_spam', 'mark_as_resolved']
    
    def mark_as_spam(self, request, queryset):
        """Mark selected submissions as spam."""
        queryset.update(status='spam')
    mark_as_spam.short_description = 'Mark selected as spam'
    
    def mark_as_resolved(self, request, queryset):
        """Mark selected submissions as resolved."""
        queryset.update(status='resolved')
    mark_as_resolved.short_description = 'Mark selected as resolved'

