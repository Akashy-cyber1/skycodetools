"""
Contact app models for SkyCode Tools.

This module contains the ContactSubmission model for storing
contact form submissions.
"""
from django.db import models
from core.models import TimestampableModel


class ContactSubmission(TimestampableModel):
    """
    Model for storing contact form submissions.
    
    Tracks contact requests from users with metadata for
    admin review and follow-up.
    """
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('spam', 'Spam'),
    ]
    
    name = models.CharField(
        max_length=200,
        help_text="Name of the person submitting the contact form"
    )
    email = models.EmailField(
        help_text="Email address for response"
    )
    subject = models.CharField(
        max_length=300,
        help_text="Subject of the message"
    )
    message = models.TextField(
        help_text="Message content"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        help_text="Current status of the submission"
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="IP address of submitter"
    )
    user_agent = models.TextField(
        blank=True,
        default='',
        help_text="Browser/user agent information"
    )
    notes = models.TextField(
        blank=True,
        default='',
        help_text="Internal admin notes for follow-up"
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['email', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.subject} ({self.status})"

