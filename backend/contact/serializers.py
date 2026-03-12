"""
Contact app serializers for SkyCode Tools.

This module contains serializers for contact form submissions.
"""
from rest_framework import serializers
from .models import ContactSubmission
import re


class ContactSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for the ContactSubmission model.
    Handles serialization and deserialization of contact form submissions.
    """
    
    class Meta:
        model = ContactSubmission
        fields = [
            'id', 'name', 'email', 'subject', 'message',
            'status', 'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'ip_address', 'user_agent', 'created_at']
    
    def validate_name(self, value):
        """Ensure name is not empty and within valid length."""
        if not value or not value.strip():
            raise serializers.ValidationError("Name is required.")
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return value.strip()
    
    def validate_email(self, value):
        """Validate email format."""
        if not value or not value.strip():
            raise serializers.ValidationError("Email is required.")
        
        # Basic email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value.strip()):
            raise serializers.ValidationError("Please enter a valid email address.")
        
        return value.strip().lower()
    
    def validate_subject(self, value):
        """Ensure subject is not empty and within valid length."""
        if not value or not value.strip():
            raise serializers.ValidationError("Subject is required.")
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Subject must be at least 3 characters.")
        if len(value) > 300:
            raise serializers.ValidationError("Subject cannot exceed 300 characters.")
        return value.strip()
    
    def validate_message(self, value):
        """Ensure message is not empty and within valid length."""
        if not value or not value.strip():
            raise serializers.ValidationError("Message is required.")
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return value.strip()
