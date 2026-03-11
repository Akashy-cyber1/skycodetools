"""
Newsletter app models for SkyCode Tools.

This module contains the NewsletterSubscriber model for managing
email subscribers.
"""
from django.db import models
from django.utils import timezone
from core.models import TimestampableModel


class NewsletterSubscriber(TimestampableModel):
    """
    Model for storing newsletter subscribers.
    
    Manages email subscriptions with confirmation flow
    and unsubscribe capability.
    """
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('unsubscribed', 'Unsubscribed'),
        ('bounced', 'Bounced'),
    ]
    
    email = models.EmailField(
        unique=True,
        help_text="Subscriber's email address"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        help_text="Subscription status"
    )
    subscribed_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the user subscribed"
    )
    unsubscribed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the user unsubscribed (if applicable)"
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="IP address at time of subscription"
    )
    confirmation_token = models.CharField(
        max_length=64,
        unique=True,
        null=True,
        blank=True,
        help_text="Token for email confirmation"
    )
    is_confirmed = models.BooleanField(
        default=False,
        help_text="Whether the email has been confirmed"
    )
    
    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'
        indexes = [
            models.Index(fields=['status', '-subscribed_at']),
        ]
    
    def __str__(self):
        return f"{self.email} ({self.status})"
    
    def unsubscribe(self):
        """Mark subscriber as unsubscribed."""
        self.status = 'unsubscribed'
        self.unsubscribed_at = timezone.now()
        self.save(update_fields=['status', 'unsubscribed_at'])
    
    def confirm(self):
        """Mark subscriber as confirmed."""
        self.is_confirmed = True
        self.save(update_fields=['is_confirmed'])

