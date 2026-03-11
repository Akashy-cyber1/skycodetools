# Backend Phase A Implementation Plan

**Version:** 1.0  
**Scope:** Database Foundations & Core Features  
**Goal:** Safe, incremental database-driven backend foundation  

---

## Executive Summary

Backend Phase A focuses on establishing safe database foundations without breaking any existing APIs. The implementation follows a conservative approach: create new apps with new models rather than modifying existing structures that could break current functionality.

### Current Backend State

| Component | Status | Location |
|-----------|--------|----------|
| Django Project | ✅ Active | `backend/skycodetools/` |
| Tools App | ✅ Active | `backend/tools/` |
| Tool Model | ✅ Basic | `backend/tools/models.py` |
| REST Framework | ✅ Configured | `backend/skycodetools/settings.py` |
| PostgreSQL | ✅ Configured | Via DATABASE_URL |

### Existing APIs (MUST NOT BREAK)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tools/` | GET, POST | List/Create tools |
| `/api/tools/{id}/` | GET, PUT, PATCH, DELETE | Tool CRUD |
| `/api/image-to-pdf/` | POST | Image to PDF |
| `/api/merge-pdf/` | POST | Merge PDFs |
| `/api/split-pdf/` | POST | Split PDF |
| `/api/image-compressor/` | POST | Compress images |
| `/api/background-remover/` | POST | Remove background |

---

## 1. Exact Django Apps to Create Now

| # | App Name | Purpose | Priority |
|---|----------|---------|----------|
| 1 | `core` | Shared utilities, abstract models, validators | 🔴 HIGH |
| 2 | `settings` | Site settings (key-value store) | 🔴 HIGH |
| 3 | `contact` | Contact form submissions | 🟡 MEDIUM |
| 4 | `feedback` | User feedback & bug reports | 🟡 MEDIUM |
| 5 | `newsletter` | Email subscribers | 🟡 MEDIUM |
| 6 | `blog` | Blog posts & categories | 🟢 LOW |

**Total: 6 new Django apps**

---

## 2. Exact Models to Create Now

### 2.1 Core App Models

```python
# backend/core/models.py
from django.db import models
from django.utils import timezone


class TimestampableModel(models.Model):
    """Abstract model with created_at and updated_at timestamps."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


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

### 2.2 Settings App Models

```python
# backend/settings/models.py
from django.db import models
from core.models import TimestampableModel


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
        ('social', 'Social Media'),
        ('other', 'Other'),
    ]
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES, default='text')
    category = models.CharField(max_length=20, choices=SETTING_CATEGORIES, default='other')
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=True)
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

### 2.3 Contact App Models

```python
# backend/contact/models.py
from django.db import models
from core.models import TimestampableModel


class ContactSubmission(TimestampableModel):
    """Contact form submissions."""
    
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
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    notes = models.TextField(blank=True)  # Admin-only notes
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['email', '-created_at']),
        ]
```

### 2.4 Feedback App Models

```python
# backend/feedback/models.py
from django.db import models
from core.models import TimestampableModel


class Feedback(TimestampableModel):
    """User feedback and bug reports."""
    
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
    
    feedback_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='other')
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

### 2.5 Newsletter App Models

```python
# backend/newsletter/models.py
from django.db import models
from django.utils import timezone
from core.models import TimestampableModel


class NewsletterSubscriber(TimestampableModel):
    """Email subscribers for newsletter."""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('unsubscribed', 'Unsubscribed'),
        ('bounced', 'Bounced'),
    ]
    
    email = models.EmailField(unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    confirmation_token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    is_confirmed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-subscribed_at']
        indexes = [
            models.Index(fields=['status', '-subscribed_at']),
        ]
    
    def unsubscribe(self):
        self.status = 'unsubscribed'
        self.unsubscribed_at = timezone.now()
        self.save()
```

### 2.6 Blog App Models

```python
# backend/blog/models.py
from django.db import models
from django.utils import timezone
from core.models import TimestampableModel


class BlogCategory(TimestampableModel):
    """Blog post categories."""
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    
    class Meta:
        verbose_name_plural = 'Blog categories'
        ordering = ['name']


class Tag(TimestampableModel):
    """Tags for blog posts."""
    
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=55, unique=True)
    
    class Meta:
        ordering = ['name']


class BlogPost(TimestampableModel):
    """Blog posts."""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=320, unique=True)
    excerpt = models.TextField(max_length=500)
    content = models.TextField()
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
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    published_at = models.DateTimeField(null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['category', '-published_at']),
        ]
    
    def publish(self):
        self.status = 'published'
        self.published_at = timezone.now()
        self.save()
    
    def archive(self):
        self.status = 'archived'
        self.save()
```

### 2.7 Tools App Enhancements (Add to existing model)

```python
# backend/tools/models.py - ADDITIONS
from django.db import models


class ToolCategory(models.Model):
    """Categories for tools."""
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Tool categories'


# Modify existing Tool model - ADD new fields (keep existing)
class Tool(models.Model):
    # ... existing fields ...
    
    # ADD these new fields (nullable to maintain backward compatibility)
    slug = models.SlugField(max_length=220, unique=True, null=True, blank=True)
    short_description = models.CharField(max_length=300, blank=True)
    category = models.ForeignKey(
        'ToolCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tools'
    )
    icon = models.ImageField(upload_to='tools/icons/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)
```

---

## 3. Exact Files Likely to be Created or Modified

### 3.1 New Files to Create

| # | File Path | Purpose |
|---|-----------|---------|
| 1 | `backend/core/__init__.py` | App config |
| 2 | `backend/core/models.py` | Abstract base models |
| 3 | `backend/core/utils.py` | Utility functions |
| 4 | `backend/core/validators.py` | Custom validators |
| 5 | `backend/core/throttling.py` | Rate limiting classes |
| 6 | `backend/settings/__init__.py` | App config |
| 7 | `backend/settings/models.py` | SiteSetting model |
| 8 | `backend/settings/admin.py` | Admin configuration |
| 9 | `backend/settings/serializers.py` | DRF serializers |
| 10 | `backend/settings/views.py` | API views |
| 11 | `backend/settings/urls.py` | URL routing |
| 12 | `backend/contact/__init__.py` | App config |
| 13 | `backend/contact/models.py` | ContactSubmission model |
| 14 | `backend/contact/admin.py` | Admin configuration |
| 15 | `backend/contact/serializers.py` | DRF serializers |
| 16 | `backend/contact/views.py` | API views |
| 17 | `backend/contact/urls.py` | URL routing |
| 18 | `backend/feedback/__init__.py` | App config |
| 19 | `backend/feedback/models.py` | Feedback model |
| 20 | `backend/feedback/admin.py` | Admin configuration |
| 21 | `backend/feedback/serializers.py` | DRF serializers |
| 22 | `backend/feedback/views.py` | API views |
| 23 | `backend/feedback/urls.py` | URL routing |
| 24 | `backend/newsletter/__init__.py` | App config |
| 25 | `backend/newsletter/models.py` | NewsletterSubscriber model |
| 26 | `backend/newsletter/admin.py` | Admin configuration |
| 27 | `backend/newsletter/serializers.py` | DRF serializers |
| 28 | `backend/newsletter/views.py` | API views |
| 29 | `backend/newsletter/urls.py` | URL routing |
| 30 | `backend/blog/__init__.py` | App config |
| 31 | `backend/blog/models.py` | BlogCategory, Tag, BlogPost models |
| 32 | `backend/blog/admin.py` | Admin configuration |
| 33 | `backend/blog/serializers.py` | DRF serializers |
| 34 | `backend/blog/views.py` | API views |
| 35 | `backend/blog/urls.py` | URL routing |

### 3.2 Files to Modify

| # | File Path | Changes |
|---|-----------|---------|
| 1 | `backend/skycodetools/settings.py` | Add 6 new apps to INSTALLED_APPS |
| 2 | `backend/skycodetools/urls.py` | Add URL includes for new apps |
| 3 | `backend/tools/models.py` | Add ToolCategory model, enhance Tool |
| 4 | `backend/tools/admin.py` | Register ToolCategory, update Tool admin |

---

## 4. Migration Order

**CRITICAL: Must run migrations in this exact order**

| # | Step | Command | Notes |
|---|------|---------|-------|
| 1 | Create core app | `python manage.py startapp core` | No migrations needed |
| 2 | Create settings app | `python manage.py startapp settings` | - |
| 3 | Create settings model | Write `settings/models.py` | - |
| 4 | Settings migration | `python manage.py makemigrations settings` | - |
| 5 | Run settings migration | `python manage.py migrate settings` | ✅ First migration |
| 6 | Create contact app | `python manage.py startapp contact` | - |
| 7 | Create contact model | Write `contact/models.py` | - |
| 8 | Contact migration | `python manage.py makemigrations contact` | - |
| 9 | Run contact migration | `python manage.py migrate contact` | ✅ Second migration |
| 10 | Create feedback app | `python manage.py startapp feedback` | - |
| 11 | Create feedback model | Write `feedback/models.py` | - |
| 12 | Feedback migration | `python manage.py makemigrations feedback` | - |
| 13 | Run feedback migration | `python manage.py migrate feedback` | ✅ Third migration |
| 14 | Create newsletter app | `python manage.py startapp newsletter` | - |
| 15 | Create newsletter model | Write `newsletter/models.py` | - |
| 16 | Newsletter migration | `python manage.py makemigrations newsletter` | - |
| 17 | Run newsletter migration | `python manage.py migrate newsletter` | ✅ Fourth migration |
| 18 | Create blog app | `python manage.py startapp blog` | - |
| 19 | Create blog models | Write `blog/models.py` | - |
| 20 | Blog migration | `python manage.py makemigrations blog` | - |
| 21 | Run blog migration | `python manage.py migrate blog` | ✅ Fifth migration |
| 22 | Update tools app | Add ToolCategory to `tools/models.py` | - |
| 23 | Tools migration | `python manage.py makemigrations tools` | - |
| 24 | Run tools migration | `python manage.py migrate tools` | ✅ Sixth migration |

**Total: 6 migration commands**

---

## 5. Admin Setup Order

| # | App | Admin Configuration | Priority |
|---|-----|---------------------|----------|
| 1 | Tools | Register ToolCategory, update Tool admin | 🔴 HIGH |
| 2 | Settings | SiteSetting admin with category filtering | 🔴 HIGH |
| 3 | Contact | ContactSubmission admin with status filters | 🟡 MEDIUM |
| 4 | Feedback | Feedback admin with type/status filters | 🟡 MEDIUM |
| 5 | Newsletter | Subscriber admin with status filters | 🟡 MEDIUM |
| 6 | Blog | Category, Tag, Post admins | 🟢 LOW |

### 5.1 Admin Features by App

**Settings Admin:**
- List view with category dropdown filter
- Search by key
- Read-only key field (prevent editing keys)
- Pre-populated initial settings

**Contact Admin:**
- List with status filter (New/In Progress/Resolved/Spam)
- Search by email or name
- Detail view with notes field
- Mark as spam action

**Feedback Admin:**
- List with type and status filters
- Link to related tool
- Search by title
- Export functionality

**Newsletter Admin:**
- List with status filter
- Search by email
- Export to CSV
- Bulk actions (delete, export)

**Blog Admin:**
- Category management
- Tag management
- Post list with status filter
- Preview functionality

---

## 6. API Work to Postpone Until Phase B

The following features are explicitly **NOT** part of Phase A:

| # | Feature | Reason for Postponement |
|---|---------|------------------------|
| 1 | **Tool Categories API** | Requires admin setup first |
| 2 | **Contact Form API** | Add in Phase B after admin tested |
| 3 | **Feedback API** | Add in Phase B after admin tested |
| 4 | **Newsletter API** | Add in Phase B after admin tested |
| 5 | **Blog API** | Lower priority, postpone |
| 6 | **Settings API** | Add in Phase B after models tested |
| 7 | **Analytics/Logging** | Performance sensitive, postpone |
| 8 | **Rate Limiting** | Add after basic features work |
| 9 | **API Documentation** | Add after all APIs ready |
| 10 | **Frontend Integration** | Phase B work |

### Phase A Focus: Database Models & Admin Only

Phase A is strictly about:
- ✅ Creating database models
- ✅ Running migrations
- ✅ Setting up admin panels
- ✅ Verifying admin functionality
- ❌ NO API endpoints (except basic Django admin)
- ❌ NO frontend changes

---

## 7. Risks to Avoid

### 7.1 High-Risk Areas

| Risk | Mitigation |
|------|------------|
| Breaking existing tool APIs | Add new fields as nullable, create new endpoints only |
| Database schema conflicts | Use separate migration files per app |
| Circular imports | Import core models in each app after core is installed |
| Admin access issues | Test admin login immediately after setup |

### 7.2 Backward Compatibility Rules

1. **Never remove fields** from existing serializers
2. **Never change field order** in existing serializers
3. **Never change response format** of existing endpoints
4. **Never rename existing endpoints**
5. **Always add new fields as nullable**

### 7.3 Safety Checkpoints

| # | Checkpoint | Verification |
|---|------------|--------------|
| 1 | After creating core app | `python manage.py check` passes |
| 2 | After settings migration | Settings table created, no data loss |
| 3 | After contact migration | Contact table created |
| 4 | After each migration | `python manage.py showmigrations` shows applied |
| 5 | After tools migration | Existing Tool data intact |
| 6 | After admin setup | Login to admin works |
| 7 | After admin setup | Can view/edit all models |

---

## 8. Manual Testing Checklist After Phase A

### 8.1 Database & Migration Tests

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Run `python manage.py check` | ✅ No errors |
| 2 | Run `python manage.py showmigrations` | All Phase A migrations show `[X]` |
| 3 | Check database tables exist | 7 new tables created |
| 4 | Verify existing Tool data | All existing tools still present |

### 8.2 Admin Panel Tests

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Access `/admin/` | Login page loads |
| 2 | Login with admin credentials | Dashboard loads |
| 3 | View Tools section | Tool and ToolCategory visible |
| 4 | Add new ToolCategory | Category saved successfully |
| 5 | Edit existing Tool | Can add category to tool |
| 6 | View Settings section | SiteSetting model visible |
| 7 | Add new SiteSetting | Setting saved successfully |
| 8 | View Contact section | ContactSubmission visible |
| 9 | Submit test contact (via shell) | Record appears in admin |
| 10 | View Feedback section | Feedback model visible |
| 11 | View Newsletter section | Subscriber model visible |
| 12 | View Blog section | Category, Tag, Post visible |

### 8.3 Existing API Tests

| # | Endpoint | Test | Expected Result |
|---|----------|------|-----------------|
| 1 | `GET /api/tools/` | List tools | Same response as before |
| 2 | `GET /api/tools/{id}/` | Get tool detail | Same response as before |
| 3 | `POST /api/tools/` | Create tool | Works as before |
| 4 | `POST /api/image-to-pdf/` | Test endpoint | Still works |
| 5 | `POST /api/merge-pdf/` | Test endpoint | Still works |
| 6 | `POST /api/split-pdf/` | Test endpoint | Still works |
| 7 | `POST /api/image-compressor/` | Test endpoint | Still works |
| 8 | `POST /api/background-remover/` | Test endpoint | Still works |

### 8.4 Visual Verification

| # | Item | Check |
|---|------|-------|
| 1 | Admin sidebar | All 7 new sections visible |
| 2 | Tool list admin | Shows Tool and ToolCategory |
| 3 | Tool detail admin | Shows new category, slug, metadata fields |
| 4 | Settings list | Filter by category works |
| 5 | Contact list | Filter by status works |
| 6 | Feedback list | Filter by type/status works |

---

## 9. Implementation Summary

### Phase A Deliverables

| Category | Count |
|----------|-------|
| New Django Apps | 6 |
| New Models | 8 |
| New Database Tables | 7 |
| Migration Commands | 6 |
| Admin Configurations | 6 |
| API Endpoints | 0 (Phase B) |

### What's NOT Included in Phase A

- Any API endpoints (POST/GET for public use)
- Rate limiting
- Frontend integration
- Newsletter confirmation emails
- Blog RSS feeds
- Analytics logging
- File uploads for feedback

### Phase B Will Add

- All API endpoints for the models created in Phase A
- Rate limiting on public endpoints
- Frontend integration
- Advanced admin features

---

## 10. Next Steps After Phase A

1. **Verify** all admin panels work correctly
2. **Seed** initial data (site settings, tool categories)
3. **Test** all existing APIs still work
4. **Begin Phase B** - API development

---

*Document prepared for Backend Phase A implementation*  
*All existing functionality must remain intact after Phase A*

