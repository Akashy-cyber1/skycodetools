"""
Tools app admin configuration for SkyCode Tools.
"""
from django.contrib import admin
from .models import Tool, ToolCategory


@admin.register(ToolCategory)
class ToolCategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for ToolCategory model.
    
    Provides:
    - List view with order sorting
    - Search by name
    - Prepopulated slug field
    """
    list_display = ('name', 'slug', 'order', 'tool_count', 'created_at')
    list_editable = ('order',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order', 'name')
    
    def tool_count(self, obj):
        """Show number of tools in this category."""
        return obj.tools.count()
    tool_count.short_description = 'Tools'


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    """
    Admin configuration for Tool model.
    
    Provides:
    - List view with category filtering
    - Search by name
    - Filter by active status
    """
    list_display = ('name', 'tool_category', 'is_active', 'order', 'created_at')
    list_filter = ('is_active', 'tool_category', 'created_at')
    search_fields = ('name', 'description', 'short_description')
    ordering = ('order', 'name')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'short_description')
        }),
        ('Category', {
            'fields': ('tool_category',)
        }),
        ('Additional', {
            'fields': ('website', 'icon', 'is_active', 'order', 'metadata'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')

