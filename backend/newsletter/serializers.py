"""
Newsletter app serializers for SkyCode Tools.

This module contains serializers for newsletter subscribers.
"""
from rest_framework import serializers
from .models import NewsletterSubscriber
import re


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    """
    Serializer for the NewsletterSubscriber model.
    Handles serialization and deserialization of newsletter subscriptions.
    """
    
    class Meta:
        model = NewsletterSubscriber
        fields = [
            'id', 'email', 'status', 'subscribed_at',
            'unsubscribed_at', 'is_confirmed', 'created_at'
        ]
        read_only_fields = [
            'id', 'status', 'subscribed_at', 'unsubscribed_at',
            'is_confirmed', 'created_at'
        ]
    
    def validate_email(self, value):
        """Validate email format and check for duplicates."""
        if not value or not value.strip():
            raise serializers.ValidationError("Email is required.")
        
        # Basic email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value.strip()):
            raise serializers.ValidationError("Please enter a valid email address.")
        
        email = value.strip().lower()
        
        # Check if email already exists
        if NewsletterSubscriber.objects.filter(email=email).exists():
            subscriber = NewsletterSubscriber.objects.get(email=email)
            if subscriber.status == 'unsubscribed':
                # Reactivate the subscription
                subscriber.status = 'active'
                subscriber.unsubscribed_at = None
                subscriber.save(update_fields=['status', 'unsubscribed_at'])
            raise serializers.ValidationError("This email is already subscribed to our newsletter.")
        
        return email


class NewsletterSubscribeSerializer(serializers.Serializer):
    """
    Simplified serializer for newsletter subscription (POST only).
    """
    
    email = serializers.EmailField(
        required=True,
        help_text="Email address to subscribe"
    )
    
    def validate_email(self, value):
        """Validate email format."""
        if not value or not value.strip():
            raise serializers.ValidationError("Email is required.")
        
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value.strip()):
            raise serializers.ValidationError("Please enter a valid email address.")
        
        return value.strip().lower()


class NewsletterUnsubscribeSerializer(serializers.Serializer):
    """
    Serializer for newsletter unsubscription.
    """
    
    email = serializers.EmailField(
        required=True,
        help_text="Email address to unsubscribe"
    )
