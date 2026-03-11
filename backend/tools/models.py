"""
Tools app models for SkyCode Tools.

This module contains the Tool and ToolCategory models.
"""
from django.db import models


class ToolCategory(models.Model):
    """
    Model for organizing tools into categories.
    
    Provides a structured way to group and display tools
    on the website.
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
    icon = models.CharField(
        max_length=50,
        blank=True,
        default='',
        help_text="Icon class name (e.g., 'fa fa-pdf')"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the category was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the category was last updated"
    )
    
    class Meta:
        verbose_name = 'Tool Category'
        verbose_name_plural = 'Tool Categories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Tool(models.Model):
    """
    Model for tools in the catalog.
    
    Stores information about each tool including name, description,
    and category. Uses category as CharField for backward compatibility
    while also supporting the new ToolCategory model.
    """
    
    name = models.CharField(
        max_length=200,
        help_text="Tool name"
    )
    description = models.TextField(
        help_text="Tool description"
    )
    website = models.URLField(
        help_text="Tool website URL"
    )
    # Keep legacy category field for backward compatibility
    category = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text="Legacy category (for backward compatibility)"
    )
    # New fields for enhanced tool catalog
    slug = models.SlugField(
        max_length=220,
        unique=True,
        null=True,
        blank=True,
        help_text="URL-friendly tool name"
    )
    short_description = models.CharField(
        max_length=300,
        blank=True,
        default='',
        help_text="Short description for previews"
    )
    tool_category = models.ForeignKey(
        'ToolCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tools',
        help_text="Category (new relation)"
    )
    icon = models.ImageField(
        upload_to='tools/icons/',
        null=True,
        blank=True,
        help_text="Tool icon"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the tool is active"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order"
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional tool metadata"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the tool was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When the tool was last updated"
    )
    
    class Meta:
        verbose_name = 'Tool'
        verbose_name_plural = 'Tools'
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return self.name

