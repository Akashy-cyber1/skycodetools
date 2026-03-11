"""
Feedback app models for SkyCode Tools.

This module contains the Feedback model for storing user feedback,
bug reports, and feature requests.
"""
from django.db import models
from core.models import TimestampableModel


class Feedback(TimestampableModel):
    """
    Model for storing user feedback, bug reports, and feature requests.
    
    Allows users to submit:
    - Bug reports
    - Feature requests
    - General improvements
    - Other feedback
    """
    
    TYPE_CHOICES = [
        ('bug', 'Bug Report'),
        ('feature', 'Feature Request'),
        ('improvement', 'Improvement'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('reviewed', 'Reviewed'),
        ('planned', 'Planned'),
        ('implemented', 'Implemented'),
        ('rejected', 'Rejected'),
        ('spam', 'Spam'),
    ]
    
    feedback_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='other',
        help_text="Type of feedback"
    )
    title = models.CharField(
        max_length=300,
        help_text="Brief title/summary of the feedback"
    )
    description = models.TextField(
        help_text="Detailed description"
    )
    tool = models.ForeignKey(
        'tools.Tool',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedbacks',
        help_text="Related tool (if applicable)"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        help_text="Current status of the feedback"
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="IP address of submitter"
    )
    attachments = models.FileField(
        upload_to='feedback/attachments/',
        null=True,
        blank=True,
        help_text="Screenshots or files related to the feedback"
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedback'
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['feedback_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"[{self.feedback_type}] {self.title} ({self.status})"

