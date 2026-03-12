from django.core.management.base import BaseCommand
from django.utils import timezone
from blog.models import BlogCategory, Tag, BlogPost
import json
from datetime import datetime

class Command(BaseCommand):
    help = 'Import static blog data from frontend to Django models'

    def handle(self, *args, **options):
        # Hardcoded static data from frontend/config/blog.ts
        blog_posts_data = [
            {
                'id': 'welcome',
                'title': 'Welcome to SkyCode Blog',
                'slug': 'welcome',
                'excerpt': 'Discover how SkyCode Tools can boost your productivity with our free online utilities. Tutorials, tips, and updates.',
                'content': """
# Welcome to SkyCode Blog

## We're Live!

SkyCode Tools blog is now live! 

Get updates on:
- New tool releases
- Productivity tips
- File processing best practices
- Tool tutorials

**Start exploring our tools today!**
                """.strip(),
                'category': 'announcement',
                'tags': ['welcome', 'blog', 'tools'],
                'publishedAt': '2024-01-15T00:00:00Z',
                'featuredImage': None,
                'seo': {
                    'metaTitle': 'Welcome to SkyCode Blog - Tutorials & Tool Updates',
                    'metaDescription': 'Discover SkyCode Tools blog with tutorials, productivity tips, and updates on our free online file processing tools.'
                }
            },
            {
                'id': 'pdf-tools-students',
                'title': '5 PDF Tools Every Student Needs',
                'slug': 'pdf-tools-students',
                'excerpt': "Master your documents with these essential PDF utilities. Perfect for assignments, research papers, and presentations.",
                'content': """
# 5 PDF Tools Every Student Needs

## 1. Merge PDF
Combine multiple PDFs into one document.

## 2. Split PDF  
Extract specific pages from large PDFs.

## 3. Image to PDF
Convert lecture slides to printable PDFs.

## Pro Tips:
- Always keep originals
- Use for study notes organization
- Share clean professional documents

**Explore all PDF tools →**
                """.strip(),
                'category': 'tutorial',
                'tags': ['pdf', 'students', 'tools', 'tutorial'],
                'publishedAt': '2024-01-20T00:00:00Z',
                'featuredImage': '/api/placeholder/600/400',
                'seo': {
                    'metaTitle': '5 Essential PDF Tools for Students | SkyCode Tools',
                    'metaDescription': "Student-friendly PDF utilities: merge, split, convert images to PDF. Free online tools for perfect documents."
                }
            },
            {
                'id': 'image-optimization',
                'title': 'Image Optimization Best Practices',
                'slug': 'image-optimization',
                'excerpt': 'Reduce file sizes by 70% without losing quality. Essential techniques for web, social media, and presentations.',
                'content': """
# Image Optimization Guide

## Compression Settings:
- JPEG: 75-85% quality
- PNG: Use PNG-8 when possible
- WebP: Modern format support

## Tools We Recommend:
1. **Image Compressor** - Lossy/lossless
2. **Background Remover** - Clean product shots

## Before/After Results:
- Original: 2.5MB → Optimized: 450KB
- Load time improved 3x

**Try our image tools now!**
                """.strip(),
                'category': 'tutorial',
                'tags': ['images', 'optimization', 'web', 'performance'],
                'publishedAt': '2024-01-25T00:00:00Z',
                'featuredImage': '/api/placeholder/600/400',
                'seo': {
                    'metaTitle': 'Image Optimization Guide | Reduce Size 70% | SkyCode Tools',
                    'metaDescription': 'Image optimization best practices. Compress without quality loss using free online tools.'
                }
            }
        ]

        created_posts = 0
        updated_posts = 0

        for post_data in blog_posts_data:
            # Category
            category, _ = BlogCategory.objects.get_or_create(
                name=post_data['category'],
                defaults={'slug': post_data['category'], 'color': '#3B82F6'}
            )

            # Tags
            for tag_name in post_data['tags']:
                Tag.objects.get_or_create(name=tag_name, defaults={'slug': tag_name})

            # Post upsert on slug
            post, created = BlogPost.objects.update_or_create(
                slug=post_data['slug'],
                defaults={
                    'title': post_data['title'],
                    'excerpt': post_data['excerpt'],
                    'content': post_data['content'],
                    'category': category,
                    'status': 'published',
                    'published_at': datetime.fromisoformat(post_data['publishedAt'].replace('Z', '+00:00')),
                    'seo': post_data['seo'],
                    'is_featured': post_data['id'] == 'welcome',  # Featured first post
                }
            )

            # Add tags
            for tag_name in post_data['tags']:
                tag = Tag.objects.get(name=tag_name)
                post.tags.add(tag)

            if created:
                created_posts += 1
            else:
                updated_posts += 1

            self.stdout.write(
                self.style.SUCCESS(f"Processed post: {post_data['title']} ({'created' if created else 'updated'})")
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Import complete: {created_posts} created, {updated_posts} updated"
            )
        )
