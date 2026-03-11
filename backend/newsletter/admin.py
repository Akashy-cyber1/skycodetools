"""
Newsletter app admin configuration for SkyCode Tools.
"""
from django.contrib import admin
from .models import NewsletterSubscriber


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    """
    Admin configuration for NewsletterSubscriber model.
    
    Provides:
    - List view with status filtering
    - Search by email
    - Export functionality
    """
    list_display = ('email', 'status', 'is_confirmed', 'subscribed_at', 'unsubscribed_at')
    list_filter = ('status', 'is_confirmed', 'subscribed_at')
    search_fields = ('email',)
    ordering = ('-subscribed_at',)
    date_hierarchy = 'subscribed_at'
    
    fieldsets = (
        ('Subscription Information', {
            'fields': ('email', 'status', 'is_confirmed')
        }),
        ('Timestamps', {
            'fields': ('subscribed_at', 'unsubscribed_at', 'ip_address'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('subscribed_at', 'ip_address', 'confirmation_token')
    
    actions = ['export_to_csv', 'mark_as_bounced']
    
    def export_to_csv(self, request, queryset):
        """Export selected subscribers to CSV."""
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="subscribers.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Email', 'Status', 'Confirmed', 'Subscribed At'])
        
        for sub in queryset:
            writer.writerow([
                sub.email,
                sub.status,
                sub.is_confirmed,
                sub.subscribed_at
            ])
        
        return response
    export_to_csv.short_description = 'Export selected to CSV'
    
    def mark_as_bounced(self, request, queryset):
        """Mark selected subscribers as bounced."""
        queryset.update(status='bounced')
    mark_as_bounced.short_description = 'Mark selected as bounced'

