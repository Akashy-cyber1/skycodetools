"""
Site Settings app models for SkyCode Tools.

This module contains the SiteSetting model for key-value site configuration.
"""
from django.db import models


class SiteSetting(models.Model):
    """
    Key-value store for site settings.
    
    Provides a flexible way to store site configuration in the database
    instead of hardcoded values. Useful for settings that may change
    frequently or need to be edited by admin users.
    """
    
    SETTING_TYPES = [
        ('text', 'Text'),
        ('number', 'Number'),
        ('boolean', 'Boolean'),
        ('json', 'JSON'),
        ('email', 'Email'),
        ('url', 'URL'),
    ]
    
    SETTING_CATEGORIES = [
        ('brand', 'Brand'),
        ('contact', 'Contact'),
        ('seo', 'SEO'),
        ('features', 'Features'),
        ('social', 'Social Media'),
        ('other', 'Other'),
    ]
    
    key = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique setting key (e.g., 'site_name')"
    )
    value = models.TextField(
        blank=True,
        default='',
        help_text="Setting value"
    )
    setting_type = models.CharField(
        max_length=20,
        choices=SETTING_TYPES,
        default='text',
        help_text="Type of value stored"
    )
    category = models.CharField(
        max_length=20,
        choices=SETTING_CATEGORIES,
        default='other',
        help_text="Category for grouping settings"
    )
    description = models.TextField(
        blank=True,
        default='',
        help_text="Human-readable description of this setting"
    )
    is_public = models.BooleanField(
        default=True,
        help_text="Whether this setting is exposed in the public API"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this setting is currently active"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'key']
        verbose_name = 'Site Setting'
        verbose_name_plural = 'Site Settings'
        indexes = [
            models.Index(fields=['category', 'key']),
            models.Index(fields=['key']),
        ]
    
    def __str__(self):
        return f"{self.key} ({self.category})"
    
    def get_typed_value(self):
        """
        Return the value cast to its appropriate Python type.
        """
        import json
        
        if self.setting_type == 'boolean':
            return self.value.lower() in ('true', '1', 'yes')
        elif self.setting_type == 'number':
            if '.' in self.value:
                return float(self.value)
            return int(self.value)
        elif self.setting_type == 'json':
            if not self.value:
                return {}
            return json.loads(self.value)
        return self.value
