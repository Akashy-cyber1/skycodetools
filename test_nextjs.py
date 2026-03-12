import requests

# Test Next.js proxy GET endpoint
print("Testing Next.js proxy GET endpoint...")
r = requests.get('http://localhost:3000/api/image-to-pdf')
print(f"Status: {r.status_code}")
print(f"Content: {r.text[:300]}")
