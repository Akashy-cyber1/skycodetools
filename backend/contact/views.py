"""
Contact app views for SkyCode Tools.

This module contains views for contact form submissions.
"""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer
import logging

logger = logging.getLogger(__name__)

User = get_user_model()


class ContactSubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the ContactSubmission model.
    
    Provides CRUD operations:
    - list: GET /contact/ - Retrieve all submissions (admin only)
    - create: POST /contact/ - Create a new contact submission
    - retrieve: GET /contact/{id}/ - Retrieve a specific submission (admin only)
    - update: PUT /contact/{id}/ - Update a specific submission (admin only)
    - destroy: DELETE /contact/{id}/ - Delete a specific submission (admin only)
    
    Public access:
    - POST /contact/ - Anyone can submit a contact form
    
    Admin access:
    - Full CRUD operations for managing submissions
    """
    
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        """
        Override to allow public POST requests for contact form submission.
        Only authenticated admins can access other methods.
        """
        if self.action == 'create':
            # Allow public access for creating contact submissions
            return []
        elif self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            # Require admin authentication for other actions
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]
    
    def get_queryset(self):
        """Filter queryset based on user permissions."""
        # Non-admin users can only see their own submissions (if authenticated)
        if self.request.user.is_superuser or (self.request.user.is_authenticated and self.request.user.is_staff):
            return ContactSubmission.objects.all()
        elif self.request.user.is_authenticated:
            return ContactSubmission.objects.filter(email=self.request.user.email)
        return ContactSubmission.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Handle contact form submission with validation."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Save with additional metadata
            instance = serializer.save(
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
            )
            logger.info(f"Contact form submitted: {instance.email} - {instance.subject}")
            return Response(
                {
                    'success': True,
                    'message': 'Thank you for your message! We will get back to you soon.',
                    'id': instance.id
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Extract client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_resolved(self, request, pk=None):
        """Mark a contact submission as resolved (admin only)."""
        submission = self.get_object()
        submission.status = 'resolved'
        submission.save(update_fields=['status'])
        return Response({'success': True, 'message': 'Submission marked as resolved'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_spam(self, request, pk=None):
        """Mark a contact submission as spam (admin only)."""
        submission = self.get_object()
        submission.status = 'spam'
        submission.save(update_fields=['status'])
        return Response({'success': True, 'message': 'Submission marked as spam'})
