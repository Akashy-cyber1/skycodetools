"""
Site Settings app admin configuration for SkyCode Tools.
"""
from django.contrib import admin
from .models import SiteSetting


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    """
    Admin configuration for SiteSetting model.
    
    Provides:
    - List view with category filtering
    - Search by key
    - Read-only key field (prevent editing keys)
    """
    list_display = ('key', 'value', 'category', 'setting_type', 'is_active', 'is_public')
    list_filter = ('category', 'setting_type', 'is_active', 'is_public')
    search_fields = ('key', 'description')
    ordering = ('category', 'key')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('key', 'value', 'setting_type')
        }),
        ('Categorization', {
            'fields': ('category', 'description')
        }),
        ('Visibility', {
            'fields': ('is_active', 'is_public')
        }),
    )
    
    # Make key field read-only to prevent issues
    readonly_fields = ('key',)
    
    # Prevent adding new settings without key
    def has_add_permission(self, request):
        # Allow add but warn about key requirement
        return True

