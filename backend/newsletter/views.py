"""
Newsletter app views for SkyCode Tools.

This module contains views for newsletter subscriptions.
"""
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import NewsletterSubscriber
from .serializers import (
    NewsletterSubscriberSerializer,
    NewsletterSubscribeSerializer,
    NewsletterUnsubscribeSerializer
)
import logging

logger = logging.getLogger(__name__)

User = get_user_model()


class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the NewsletterSubscriber model.
    
    Provides CRUD operations:
    - list: GET /subscribers/ - Retrieve all subscribers (admin only)
    - create: POST /subscribers/ - Subscribe a new email
    - retrieve: GET /subscribers/{id}/ - Retrieve a specific subscriber (admin only)
    - destroy: DELETE /subscribers/{id}/ - Delete a specific subscriber (admin only)
    
    Public access:
    - POST /subscribers/ - Anyone can subscribe
    - POST /subscribers/unsubscribe/ - Anyone can unsubscribe
    
    Admin access:
    - Full CRUD operations for managing subscribers
    """
    
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        """
        Override to allow public POST requests for subscription.
        Only authenticated admins can access list/retrieve.
        """
        if self.action == 'create':
            # Allow public access for subscriptions
            return []
        elif self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            # Require admin authentication
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]
    
    def get_queryset(self):
        """Filter queryset based on user permissions."""
        if self.request.user.is_superuser or (self.request.user.is_authenticated and self.request.user.is_staff):
            return NewsletterSubscriber.objects.all()
        return NewsletterSubscriber.objects.filter(status='active')
    
    def create(self, request, *args, **kwargs):
        """Handle newsletter subscription with validation."""
        serializer = NewsletterSubscribeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Check if already subscribed
            if NewsletterSubscriber.objects.filter(email=email, status='active').exists():
                return Response(
                    {'success': False, 'message': 'This email is already subscribed.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if previously subscribed but unsubscribed
            existing = NewsletterSubscriber.objects.filter(email=email).first()
            if existing and existing.status == 'unsubscribed':
                # Reactivate the subscription
                existing.status = 'active'
                existing.unsubscribed_at = None
                existing.save(update_fields=['status', 'unsubscribed_at'])
                logger.info(f"Newsletter re-subscription: {email}")
                return Response(
                    {
                        'success': True,
                        'message': 'You have been re-subscribed to our newsletter!',
                        'email': email
                    },
                    status=status.HTTP_200_OK
                )
            
            # Create new subscription
            subscriber = NewsletterSubscriber.objects.create(
                email=email,
                status='active',
                ip_address=self.get_client_ip(request)
            )
            logger.info(f"New newsletter subscription: {email}")
            return Response(
                {
                    'success': True,
                    'message': 'Thank you for subscribing to our newsletter!',
                    'email': email
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
    
    @action(detail=False, methods=['post'])
    def unsubscribe(self, request):
        """
        Unsubscribe from newsletter (public endpoint).
        POST /api/subscribers/unsubscribe/
        """
        serializer = NewsletterUnsubscribeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                subscriber = NewsletterSubscriber.objects.get(email=email)
                subscriber.unsubscribe()
                logger.info(f"Newsletter unsubscription: {email}")
                return Response(
                    {
                        'success': True,
                        'message': 'You have been unsubscribed from our newsletter.'
                    },
                    status=status.HTTP_200_OK
                )
            except NewsletterSubscriber.DoesNotExist:
                return Response(
                    {'success': False, 'message': 'This email is not subscribed.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def status(self, request):
        """
        Check subscription status (public endpoint).
        GET /api/subscribers/status/?email=example@example.com
        """
        email = request.query_params.get('email')
        if not email:
            return Response(
                {'success': False, 'message': 'Email parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            subscriber = NewsletterSubscriber.objects.get(email=email.lower())
            return Response(
                {
                    'success': True,
                    'email': subscriber.email,
                    'subscribed': subscriber.status == 'active',
                    'is_confirmed': subscriber.is_confirmed
                },
                status=status.HTTP_200_OK
            )
        except NewsletterSubscriber.DoesNotExist:
            return Response(
                {
                    'success': True,
                    'email': email,
                    'subscribed': False,
                    'is_confirmed': False
                },
                status=status.HTTP_200_OK
            )
