# SkyCode Tools - Backend Architecture Plan

**Version:** 1.0  
**Target:** Production-Ready Scalable Platform  
**Frontend:** Next.js 14  
**Backend:** Django 5.2 + Django REST Framework  
**Database:** PostgreSQL  

---

## Executive Summary

This document outlines a comprehensive backend architecture plan for transforming SkyCode Tools into a scalable, database-driven platform suitable for long-term growth. The plan maintains backward compatibility with existing APIs while introducing new features for content management, analytics, and user engagement.

---

## Table of Contents

1. [Recommended Django App Structure](#1-recommended-django-app-structure)
2. [Recommended PostgreSQL Data Models](#2-recommended-postgresql-data-models)
3. [Database vs Config Files Strategy](#3-database-vs-config-files-strategy)
4. [Model/Entity List](#4-modelentity-list)
5. [API Module Plan](#5-api-module-plan)
6. [Validation & Security Considerations](#6-validation--security-considerations)
7. [Rate Limiting & Spam Prevention](#7-rate-limiting--spam-prevention)
8. [Backup & Data Safety](#8-backup--data-safety)
9. [Implementation Order](#9-implementation-order)
10. [Migration Strategy](#10-migration-strategy)

---

## 1. Recommended Django App Structure

### 1.1 Current Structure
```
backend/
├── skycodetools/          # Project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── tools/                 # Single app (current)
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── requirements.txt
└── manage.py
```

### 1.2 Proposed Scalable Structure
```
backend/
├── skycodetools/              # Project settings
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── core/                      # Core utilities app
│   ├── __init__.py
│   ├── models.py             # Abstract base models
│   ├── constants.py          # App-wide constants
│   ├── utils.py              # Utility functions
│   ├── mixins.py             # Reusable mixins
│   ├── throttling.py         # Custom throttle classes
│   └── validators.py         # Custom validators
├── tools/                     # Tool catalog app (refactor existing)
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── management/
│       └── commands/
├── contact/                   # Contact form submissions
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
├── feedback/                  # Feedback / Report issue
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
├── blog/                      # Blog posts and categories
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── feeds.py              # RSS feeds
├── newsletter/                # Newsletter subscribers
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── management/
│       └── commands/
├── analytics/                 # Tool usage logs
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── middleware.py         # Auto-logging middleware
├── chat/                      # AI chat (future)
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
├── settings/                  # Site settings (key-value store)
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
├── api/                       # API routing and versioning
│   ├── __init__.py
│   ├── urls.py
│   ├── routers.py
│   └── versioning.py
├── manage.py
├── requirements.txt
├── .env.example
└── gunicorn_config.py
```

### 1.3 App Responsibilities

| App | Purpose |
|-----|---------|
| `core` | Shared utilities, base models, constants, validators |
| `tools` | Tool catalog management, tool execution endpoints |
| `contact` | Contact form submissions storage and management |
| `feedback` | User feedback and bug reports |
| `blog` | Blog posts, categories, tags |
| `newsletter` | Email subscribers management |
| `analytics` | Usage logs, events, metrics |
| `chat` | AI chat history (future feature) |
| `settings` | Dynamic site configuration |
| `api` | Central API routing and versioning |

---

## 2. Recommended PostgreSQL Data Models

### 2.1 Core Abstract Models

```python
# core/models.py

from django.db import models
from django.utils import timezone


class TimestampableModel(models.Model):
    """Abstract model with created_at and updated_at timestamps."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublishableModel(models.Model):
    """Abstract model with publish workflow."""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def publish(self):
        self.status = 'published'
        self.published_at = timezone.now()
        self.save()

    def archive(self):
        self.status = 'archived'
        self.save()


class SoftDeletableModel(models.Model):
    """Abstract model with soft delete capability."""
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save()
```

---

## 3. Database vs Config Files Strategy

### 3.1 Store in Database

| Feature | Reason |
|---------|--------|
| **Tool Catalog** | Admin-manageable, frequent updates |
| **Contact/Feedback** | Must be stored, queried, managed |
| **Blog Posts** | CMS functionality, searchable |
| **Newsletter Subscribers** | Active management, exports |
| **Site Settings** | Dynamic changes without deploy |
| **Analytics Logs** | Large datasets, querying needs |
| **Chat History** | User-specific, persistent |

### 3.2 Store in Environment Variables / Config Files

| Setting | Reason |
|---------|--------|
| `SECRET_KEY` | Security-critical, never in DB |
| `DATABASE_URL` | Infrastructure config |
| `DEBUG` | Environment-specific |
| `ALLOWED_HOSTS` | Infrastructure config |
| `REMOVE_BG_API_KEY` | API credentials |
| `EMAIL_HOST_PASSWORD` | Credentials |
| `AWS_S3_*` | Storage credentials |
| `REDIS_URL` | Cache/queue config |

### 3.3 Hybrid Approach for Settings

Use database for **user-facing settings** that may change frequently:
- Support email (displayed on site)
- WhatsApp number
- Brand settings (logo, colors)
- SEO defaults (meta descriptions)
- Feature flags

Use environment variables for **security/infrastructure**:
- API keys
- Database credentials
- Third-party service credentials

---

## 4. Model/Entity List

### 4.1 Core Models

#### Tool (Existing - Refactor)
```python
class Tool(TimestampableModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=300)
    website = models.URLField()
    category = models.ForeignKey(
        'ToolCategory', 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='tools'
    )
    icon = models.ImageField(upload_to='tools/icons/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict)  # Flexible tool-specific data
    
    class Meta:
        ordering = ['order', '-created_at']


class ToolCategory(TimestampableModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Icon name
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Tool categories'
```

### 4.2 Contact & Feedback Models

#### ContactSubmission
```python
class ContactSubmission(TimestampableModel):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('spam', 'Spam'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300)
    message = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='new'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    notes = models.TextField(blank=True)  # Admin notes
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['email', '-created_at']),
        ]
```

#### Feedback
```python
class Feedback(TimestampableModel):
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
    
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedbacks'
    )
    feedback_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=300)
    description = models.TextField()
    tool = models.ForeignKey(
        'tools.Tool',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feedbacks'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    attachments = models.FileField(
        upload_to='feedback/attachments/',
        null=True,
        blank=True
    )
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['feedback_type', '-created_at']),
        ]
```

### 4.3 Blog Models

#### BlogCategory
```python
class BlogCategory(TimestampableModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    
    class Meta:
        verbose_name_plural = 'Blog categories'
        ordering = ['name']
```

#### BlogPost (PublishableModel)
```python
class BlogPost(PublishableModel):
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=320, unique=True)
    excerpt = models.TextField(max_length=500)
    content = models.TextField()  # Or RichTextField if using django-ckeditor
    featured_image = models.ImageField(
        upload_to='blog/featured/',
        null=True,
        blank=True
    )
    author = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='blog_posts'
    )
    category = models.ForeignKey(
        'BlogCategory',
        on_delete=models.SET_NULL,
        null=True,
        related_name='posts'
    )
    tags = models.ManyToManyField('Tag', blank=True)
    view_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['category', '-published_at']),
        ]


class Tag(TimestampableModel):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=55, unique=True)
    
    class Meta:
        ordering = ['name']
```

### 4.4 Newsletter Models

#### NewsletterSubscriber
```python
class NewsletterSubscriber(TimestampableModel):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('unsubscribed', 'Unsubscribed'),
        ('bounced', 'Bounced'),
    ]
    
    email = models.EmailField(unique=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    subscribedTimeField(auto_now_at = models.Date_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    confirmation_token = models.CharField(max_length=64, unique=True)
    is_confirmed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-        indexes = [
            models.Index(fields=['status', '-subscribed_at']),
subscribed_at']
        ]
    
    def unsubscribe(self):
        self.status = 'unsubscribed'
        self.unsubscribed_at = timezone.now()
        self.save()
```

### 4.5 Site Settings Models

#### SiteSetting
```python
class SiteSetting(TimestampableModel):
    """Key-value store for site settings."""
    
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
        ('analytics', 'Analytics'),
        ('social', 'Social Media'),
        ('other', 'Other'),
    ]
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES)
    category = models.CharField(max_length=20, choices=SETTING_CATEGORIES)
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=True)  # Expose in API?
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['category', 'key']
        indexes = [
            models.Index(fields=['category', 'key']),
        ]
    
    def get_typed_value(self):
        """Return value cast to appropriate type."""
        import json
        if self.setting_type == 'boolean':
            return self.value.lower() in ('true', '1', 'yes')
        elif self.setting_type == 'number':
            return float(self.value) if '.' in self.value else int(self.value)
        elif self.setting_type == 'json':
            return json.loads(self.value)
        return self.value
```

**Predefined Settings (seed data):**
| Key | Type | Category |
|-----|------|----------|
| `site_name` | text | brand |
| `site_logo` | url | brand |
| `support_email` | email | contact |
| `whatsapp_number` | text | contact |
| `default_meta_title` | text | seo |
| `default_meta_description` | text | seo |
| `default_meta_keywords` | text | seo |
| `enable_newsletter` | boolean | features |
| `enable_chat` | boolean | features |

### 4.6 Analytics Models

#### ToolUsageLog
```python
class ToolUsageLog(TimestampableModel):
    """Log each tool usage for analytics."""
    
    tool = models.ForeignKey(
        'tools.Tool',
        on_delete=models.CASCADE,
        related_name='usage_logs'
    )
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tool_usages'
    )
    session_key = models.CharField(max_length=64, null=True, blank=True)
    
    # Request metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    
    # Usage details
    input_file_count = models.PositiveIntegerField(default=0)
    input_file_types = models.JSONField(default=list)
    input_total_size = models.BigIntegerField(default=0)  # bytes
    
    # Result
    output_file_count = models.PositiveIntegerField(default=0)
    output_total_size = models.BigIntegerField(default=0)  # bytes
    processing_time = models.FloatField(null=True, blank=True)  # seconds
    
    # Status
    is_success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)
    
    # Additional metadata
    metadata = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['tool', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['session_key', '-created_at']),
            models.Index(fields=['ip_address', '-created_at']),
            models.Index(fields=['is_success', '-created_at']),
            # Composite index for common queries
            models.Index(fields=['tool', 'is_success', '-created_at']),
        ]
        # Partition by month (requires PostgreSQL 11+ with pg_partman)
        # or use table partitioning at database level


class PageView(TimestampableModel):
    """Track page views for analytics."""
    
    path = models.CharField(max_length=500)
    title = models.CharField(max_length=300, blank=True)
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='page_views'
    )
    session_key = models.CharField(max null=True, blank_length=64,=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    view_duration = models.PositiveIntegerField(default=0)  # seconds
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['path', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]
```

### 4.7 AI Chat Models (Future)

#### ChatSession
```python
class ChatSession(TimestampableModel):
    """Chat session for AI conversations."""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='chat_sessions'
    )
    title = models.CharField(max_length=300)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    total_messages = models.PositiveIntegerField(default=0)
    total_tokens = models.PositiveIntegerField(default=0)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]


class ChatMessage(TimestampableModel):
    """Individual messages in a chat session."""
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ]
    
    session = models.ForeignKey(
        'ChatSession',
        on_delete=models.CASCADE,
        related_name='messages'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    tokens = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['session', 'created_at']),
        ]
```

---

## 5. API Module Plan

### 5.1 API Structure

```
api/
├── v1/
│   ├── __init__.py
│   ├── urls.py
│   ├── routers.py
│   └── endpoints/
│       ├── __init__.py
│       ├── tools.py
│       ├── contact.py
│       ├── feedback.py
│       ├── blog.py
│       ├── newsletter.py
│       ├── settings.py
│       ├── analytics.py
│       └── chat.py
```

### 5.2 API Endpoints Summary

| Feature | Endpoint | Methods | Description |
|---------|----------|---------|-------------|
| **Tools** | `/api/v1/tools/` | GET, POST | List/Create tools |
| | `/api/v1/tools/{slug}/` | GET, PUT, DELETE | Tool details |
| | `/api/v1/tools/categories/` | GET | List categories |
| **Contact** | `/api/v1/contact/` | POST | Submit contact form |
| | `/api/v1/contact/` | GET | List submissions (admin) |
| | `/api/v1/contact/{id}/` | GET, PATCH | View/Update (admin) |
| **Feedback** | `/api/v1/feedback/` | POST | Submit feedback |
| | `/api/v1/feedback/` | GET | List feedback (admin) |
 | `/api/v1/blog/posts| **Blog**/` | GET | List published posts |
| | `/api/v1/blog/posts/{slug}/` | GET | Post details |
| | `/api/v1/blog/categories/` | GET | List categories |
| | `/api/v1/blog/tags/` | GET | List tags |
| **Newsletter** | `/api/v1/newsletter/subscribe/` | POST | Subscribe |
| | `/api/v1/newsletter/unsubscribe/` | POST | Unsubscribe |
| | `/api/v1/newsletter/subscribers/` | GET | List (admin) |
| **Settings** | `/api/v1/settings/` | GET | Public settings |
| | `/api/v1/settings/{key}/` | GET, PUT | Specific setting |
| **Analytics** | `/api/v1/analytics/tool-usage/` | POST | Log usage |
| | `/api/v1/analytics/dashboard/` | GET | Dashboard stats |
| **Chat** | `/api/v1/chat/sessions/` | GET, POST | List/Create sessions |
| | `/api/v1/chat/sessions/{id}/messages/` | GET, POST | Messages |

### 5.3 API Versioning Strategy

```python
# api/v1/versioning.py
from rest_framework.versioning import URLPathVersioning

class CustomVersioning(URLPathVersioning):
    default_version = 'v1'
    allowed_versions = ['v1']
    version_param = 'version'
```

### 5.4 Response Format Standardization

```python
# core/api_utils.py
from rest_framework.response import Response
from rest_framework import status

def api_response(data=None, message=None, success=True, status_code=200):
    """Standardized API response format."""
    response_data = {
        'success': success,
    }
    if message:
        response_data['message'] = message
    if data is not None:
        response_data['data'] = data
    
    return Response(response_data, status=status_code)


def api_error(message, errors=None, status_code=400):
    """Standardized error response."""
    response_data = {
        'success': False,
        'message': message,
    }
    if errors:
        response_data['errors'] = errors
    
    return Response(response_data, status=status_code)
```

---

## 6. Validation & Security Considerations

### 6.1 Input Validation

```python
# core/validators.py
from django.core.validators import RegexValidator, EmailValidator
from django.core.exceptions import ValidationError
import re

# Phone number validator (international)
phone_validator = RegexValidator(
    regex=r'^\+?[1-9]\d{1,14}$',
    message="Enter a valid phone number (E.164 format, e.g., +1234567890)"
)

# URL validator (stricter)
def validate_safe_url(url):
    """Ensure URL is safe and doesn't contain malicious content."""
    if url:
        disallowed = ['javascript:', 'data:', 'vbscript:']
        url_lower = url.lower()
        for pattern in disallowed:
            if pattern in url_lower:
                raise ValidationError(f"URLs containing '{pattern}' are not allowed")
    return url

# Text content validator
def validate_no_html(content):
    """Ensure content doesn't contain HTML tags (basic XSS prevention)."""
    if content:
        html_pattern = re.compile(r'<[^>]+>')
        if html_pattern.search(content):
            raise ValidationError("HTML tags are not allowed in this field")
    return content
```

### 6.2 API Security Headers

```python
# skycodetools/settings.py (additions)

MIDDLEWARE = [
    # ... existing middleware
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # Add custom security middleware
    'core.middleware.SecurityHeadersMiddleware',
]

# Custom security middleware
# core/middleware.py
class SecurityHeadersMiddleware:
    """Add additional security headers."""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Content Security Policy
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https:; "
            "frame-ancestors 'none';"
        )
        
        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy
        response['Permissions-Policy'] = (
            'camera=(), '
            'microphone=(), '
            'geolocation=()'
        )
        
        return response
```

### 6.3 Authentication & Authorization

```python
# core/permissions.py
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read for everyone, write for admins only."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow owners or admins to access resources."""
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        # Check if obj has user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False
```

### 6.4 File Upload Security

```python
# core/validators.py (additions)
from django.core.validators import FileExtensionValidator
import magic

ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt']
ALLOWED_ARCHIVE_EXTENSIONS = ['zip', 'tar', 'gz', 'rar']

def validate_image_file(file):
    """Validate image file using magic bytes."""
    # Check extension
    ext_validator = FileExtensionValidator(allowed_extensions=ALLOWED_IMAGE_EXTENSIONS)
    ext_validator(file)
    
    # Check content type
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if file.content_type not in allowed_types:
        raise ValidationError(f"Unsupported file type: {file.content_type}")
    
    # Check magic bytes (first 2048 bytes)
    file.seek(0)
    file_header = file.read(2048)
    file.seek(0)
    
    # Validate image signatures
    valid_signatures = [
        b'\xFF\xD8\xFF',  # JPEG
        b'\x89PNG\r\n\x1a\n',  # PNG
        b'GIF87a',  # GIF87a
        b'GIF89a',  # GIF89a
        b'RIFF',    # WebP
    ]
    
    if not any(file_header.startswith(sig) for sig in valid_signatures):
        raise ValidationError("File does not appear to be a valid image")
    
    return True

# Max file sizes
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_DOCUMENT_SIZE = 25 * 1024 * 1024  # 25 MB
MAX_ARCHIVE_SIZE = 100 * 1024 * 1024  # 100 MB
```

---

## 7. Rate Limiting & Spam Prevention

### 7.1 Rate Limiting Configuration

```python
# skycodetools/settings.py (additions)
REST_FRAMEWORK = {
    # ... existing settings
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '500/hour',
        'contact': '5/hour',
        'feedback': '10/hour',
        'newsletter': '3/hour',
        'tool_usage': '200/hour',
    },
}
```

### 7.2 Custom Throttle Classes

```python
# core/throttling.py
from rest_framework.throttling import SimpleRateThrottle
from django.core.cache import cache
from datetime import datetime, timedelta


class ContactFormThrottle(SimpleRateThrottle):
    """Rate limit contact form submissions."""
    scope = 'contact'
    
    def get_cache_key(self, request, view):
        # Use IP + email to prevent spam from same IP with different emails
        email = request.data.get('email', '')
        ident = f"{self.get_ident(request)}:{email}"
        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }


class HoneypotThrottle(SimpleRateThrottle):
    """Throttle based on honeypot field."""
    scope = 'honeypot'
    
    def get_cache_key(self, request, view):
        # If honeypot is filled, throttle heavily
        honeypot = request.data.get('website_url', '') or request.data.get('hp_field', '')
        if honeypot:
            # Very aggressive throttling for bots
            ident = self.get_ident(request)
            return self.cache_format % {
                'scope': 'honeypot_block',
                'ident': ident
            }
        return None  # No throttle for legitimate users
```

### 7.3 Spam Prevention Strategies

```python
# Contact/Feedback forms - Add to serializers
class ContactSubmissionSerializer(serializers.ModelSerializer):
    # Honeypot field (hidden from users)
    honeypot = serializers.CharField(required=False, allow_blank=True)
    
    def validate_honeypot(self, value):
        """Reject if honeypot is filled."""
        if value and len(value) > 0:
            raise serializers.ValidationError("This submission was detected as spam.")
        return ''
    
    def validate(self, attrs):
        """Additional spam checks."""
        # Check submission speed (too fast = likely bot)
        # This requires storing timestamp in form
        request = self.context.get('request')
        if request:
            # Could add timing validation here
            pass
        
        return attrs


# models.py - Add spam detection fields
class ContactSubmission(models.Model):
    # ... existing fields
    is_marked_spam = models.BooleanField(default=False)
    spam_score = models.FloatField(default=0.0)  # For ML-based spam detection
    ip_country = models.CharField(max_length=2, blank=True)  # Country code
```

### 7.4 reCAPTCHA Integration (Optional)

```python
# core/recaptcha.py
import requests
from django.conf import settings

def verify_recaptcha(token):
    """Verify Google reCAPTCHA v3 token."""
    if not token:
        return False
    
    secret_key = getattr(settings, 'RECAPTCHA_SECRET_KEY', None)
    if not secret_key:
        return True  # Skip if no key configured
    
    try:
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': secret_key,
                'response': token,
            },
            timeout=10
        )
        result = response.json()
        return result.get('score', 0) > 0.5  # For v3
    except:
        return True  # Fail open on errors
```

---

## 8. Backup & Data Safety

### 8.1 Database Backup Strategy

```yaml
# .github/workflows/backup.yml
name: Daily Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Dump PostgreSQL database
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
      
      - name: Upload to cloud storage
        uses: actions/upload-artifact@v3
        with:
          name: database-backup
          path: backup_*.sql
          retention-days: 30
```

### 8.2 Application-Level Export

```python
# core/management/commands/export_data.py
from django.core.management.base import BaseCommand
from tools.models import Tool
from blog.models import BlogPost
from newsletter.models import NewsletterSubscriber
import json
from datetime import datetime

class Command(BaseCommand):
    help = 'Export all data to JSON for backup'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            default=f'backup_{datetime.now().strftime("%Y%m%d")}.json',
            help='Output file path'
        )
    
    def handle(self, *args, **options):
        data = {
            'exported_at': datetime.now().isoformat(),
            'tools': [],
            'blog_posts': [],
            'subscribers': [],
        }
        
        # Export tools
        for tool in Tool.objects.all():
            data['tools'].append({
                'name': tool.name,
                'slug': tool.slug,
                'description': tool.description,
                # ... other fields
            })
        
        # Export blog posts
        for post in BlogPost.objects.filter(status='published'):
            data['blog_posts'].append({
                'title': post.title,
                'slug': post.slug,
                'content': post.content,
                # ... other fields
            })
        
        # Export subscribers (PII - encrypt in production!)
        for sub in NewsletterSubscriber.objects.filter(status='active'):
            data['subscribers'].append({
                'email': sub.email,
                'subscribed_at': sub.subscribed_at.isoformat(),
            })
        
        # Write to file
        with open(options['output'], 'w') as f:
            json.dump(data, f, indent=2)
        
        self.stdout.write(self.style.SUCCESS(f'Data exported to {options["output"]}'))
```

### 8.3 Data Retention Policies

```python
# analytics/models.py (add to ToolUsageLog)
class ToolUsageLog(models.Model):
    # ... existing fields
    
    class Meta:
        # Database-level TTL (PostgreSQL 11+)
        # Or use pg_partman for time-based partitioning
        indexes = [
            # Ensure efficient deletion of old records
            models.Index(fields=['created_at']),
        ]
    
    # In management command or Celery task:
    # Delete logs older than 90 days (configurable)
```

### 8.4 Database Optimization Settings

```sql
-- Add to PostgreSQL for better performance
-- Create indexes for common queries

-- Analytics queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tool_usage_tool_created 
ON analytics_toolusagelog (tool_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tool_usage_daily 
ON analytics_toolusagelog (created_at date);

-- Blog queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_post_status_published 
ON blog_blogpost (status, published_at DESC) 
WHERE status = 'published';

-- Full-text search
ALTER TABLE blog_blogpost ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS idx_blog_search 
ON blog_blogpost USING GIN (search_vector);
```

---

## 9. Implementation Order

### Phase 1: Foundation (Weeks 1-2)
**Priority: Critical**

| Step | Task | Description |
|------|------|-------------|
| 1.1 | Create app structure | Create all Django apps |
| 1.2 | Core utilities | Abstract models, validators, throttles |
| 1.3 | Site Settings app | Implement key-value settings |
| 1.4 | Settings API | Public API for frontend |
| 1.5 | Move existing Tool model | Refactor to new structure |

### Phase 2: Content Management (Weeks 2-3)
**Priority: High**

| Step | Task | Description |
|------|------|-------------|
| 2.1 | Contact form app | Full implementation |
| 2.2 | Feedback app | Full implementation |
| 2.3 | Newsletter app | Subscriptions management |
| 2.4 | Admin customization | Better admin interfaces |

### Phase 3: Blog & CMS (Weeks 3-4)
**Priority: High**

| Step | Task | Description |
|------|------|-------------|
| 3.1 | Blog models | Categories, posts, tags |
| 3.2 | Blog API | CRUD + public endpoints |
| 3.3 | Blog admin | Rich text editor integration |
| 3.4 | RSS feeds | For blog syndication |

### Phase 4: Analytics (Weeks 4-5)
**Priority: Medium**

| Step | Task | Description |
|------|------|-------------|
| 4.1 | Analytics models | Usage logs, page views |
| 4.2 | Middleware | Auto-log page views |
| 4.3 | Tool usage logging | Hook into tool endpoints |
| 4.4 | Dashboard API | Aggregated stats |

### Phase 5: AI Chat (Weeks 5-6)
**Priority: Low (Future)**

| Step | Task | Description |
|------|------|-------------|
| 5.1 | Chat models | Sessions, messages |
| 5.2 | Chat API | CRUD operations |
| 5.3 | Integration | Connect to AI provider |

### Phase 6: Polish & Security (Weeks 6-7)
**Priority: High**

| Step | Task | Description |
|------|------|-------------|
| 6.1 | Rate limiting | Fine-tune throttles |
| 6.2 | Spam prevention | Honeypot, reCAPTCHA |
| 6.3 | Documentation | API docs (Swagger) |
| 6.4 | Performance | Query optimization |

---

## 10. Migration Strategy

### 10.1 Safe Migration Steps

1. **Backup First**
   ```bash
   python manage.py dumpdata > pre_migration_backup.json
   ```

2. **Create New Apps**
   ```bash
   python startapp core
   python startapp contact
   python startapp feedback
   python startapp blog
   python startapp newsletter
   python startapp analytics
   python startapp settings
   python startapp chat
   ```

3. **Update INSTALLED_APPS**
   ```python
   INSTALLED_APPS = [
       # ... existing
       'core',
       'contact',
       'feedback',
       'blog',
       'newsletter',
       'analytics',
       'settings',
       'chat',
   ]
   ```

4. **Run Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Verify & Deploy**
   - Test all endpoints
   - Monitor error logs
   - Deploy to staging

### 10.2 Backward Compatibility

Keep existing URLs working:
```python
# tools/urls.py additions
# Keep backward compatible URLs
urlpatterns = [
    # ... existing URLs
    # Add new API endpoints
    path('tools/categories/', include('tools.category_urls')),
]
```

---

## Appendix A: File Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `core/models.py` | Abstract base models |
| `core/validators.py` | Custom validators |
| `core/throttling.py` | Custom throttles |
| `core/middleware.py` | Security middleware |
| `core/permissions.py` | Custom permissions |
| `core/api_utils.py` | API response helpers |
| `contact/models.py` | Contact submission model |
| `feedback/models.py` | Feedback model |
| `blog/models.py` | Blog models |
| `newsletter/models.py` | Subscriber model |
| `settings/models.py` | Site settings model |
| `analytics/models.py` | Analytics models |
| `chat/models.py` | Chat models |
| `api/v1/urls.py` | API routing |

### Modified Files

| File | Changes |
|------|---------|
| `settings.py` | Add apps, DRF config, throttling |
| `tools/models.py` | Add categories, enhance fields |
| `tools/views.py` | Add new endpoints |
| `tools/urls.py` | New URL patterns |

---

## Appendix B: Dependencies

### Required Packages

```
Django==5.2.1
djangorestframework==3.16.1
django-cors-headers==4.9.0
dj-database-url==3.1.2
django-filter==24.3  # For filtering
drf-spectacular==0.28.0  # API documentation
django-crispy-forms==2.3  # Admin forms
Pillow==11.1.0  # Image processing
redis==5.2.1  # Cache (optional)
celery==5.4.0  # Async tasks (optional)
django-redis==5.4.0  # Redis cache backend (optional)
```

---

 Version: 1*Document.0*  
*Last Updated: 2025*  
*Architecture Lead: Senior Django Architect*

