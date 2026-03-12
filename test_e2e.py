"""
End-to-end test for image-to-pdf flow
Tests:
1. Frontend -> Next.js proxy
2. Next.js proxy -> Django backend
"""
import requests
import io
from PIL import Image
import os

# Create a simple test image in memory
def create_test_image():
    img = Image.new('RGB', (200, 100), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

# Test 1: Django backend directly
print("=" * 60)
print("TEST 1: Django backend directly")
print("=" * 60)

try:
    img = create_test_image()
    files = {'files': ('test.png', img, 'image/png')}
    response = requests.post(
        'http://127.0.0.1:8000/api/image-to-pdf/',
        files=files,
        timeout=30
    )
    print(f"URL: http://127.0.0.1:8000/api/image-to-pdf/")
    print(f"Status: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    if response.status_code == 200:
        print(f"Content-Length: {len(response.content)} bytes")
        print("✅ Django backend WORKS - returns PDF")
    else:
        print(f"❌ Error: {response.text[:200]}")
except Exception as e:
    print(f"❌ Django backend error: {e}")

print()

# Test 2: Next.js proxy (this is what the frontend uses)
print("=" * 60)
print("TEST 2: Next.js proxy (frontend uses this)")
print("=" * 60)

try:
    img = create_test_image()
    files = {'files': ('test.png', img, 'image/png')}
    response = requests.post(
        'http://localhost:3000/api/image-to-pdf',
        files=files,
        timeout=30
    )
    print(f"URL: http://localhost:3000/api/image-to-pdf")
    print(f"Status: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    if response.status_code == 200:
        print(f"Content-Length: {len(response.content)} bytes")
        print("✅ Next.js proxy WORKS - returns PDF")
    else:
        print(f"❌ Error: {response.text[:500]}")
except Exception as e:
    print(f"❌ Next.js proxy error: {e}")

print()
print("=" * 60)
print("SUMMARY")
print("=" * 60)
print("If both tests return PDF, the fix is working correctly.")
print("The frontend now uses the Next.js proxy which forwards to Django.")

