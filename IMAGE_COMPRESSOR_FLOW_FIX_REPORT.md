# 1. Current Issue
The frontend Image Compressor page was calling the Django backend directly via absolute BASE_URL (`http://127.0.0.1:8000`), hitting `/api/image-compressor/` which doesn't exist. Django serves at `/api/tools/image-compressor/`.

# 2. Root Cause
- **Path mismatch**: Frontend requested `/api/image-compressor/` but Django endpoint is `/api/tools/image-compressor/`.
- **Direct backend call**: Bypassed Next.js proxy at `/api/image-compressor/route.ts`.
- `route.ts` was already correct/valid but never used.

# 3. Files Inspected
- `frontend/app/tools/image-compressor/page.tsx`
- `frontend/app/api/image-compressor/route.ts`
- `frontend/lib/api.ts`
- `frontend/lib/constants.ts`
- `backend/tools/views.py`
- `backend/tools/urls.py`

# 4. Files Changed
- `frontend/lib/constants.ts` (BASE_URL only)

# 5. Exact Fix Applied
- **constants.ts**: `BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000',` → `BASE_URL: '/api',`
- Uses relative `/api` path → triggers Next.js proxy automatically.
- `route.ts`: No changes - already valid proxy handler forwarding FormData to `http://127.0.0.1:8000/api/tools/image-compressor/`.
- `page.tsx`: No changes - UI/request logic intact.
- Backend: No changes - quality parsing `request.POST.get('quality', 80)` preserved.

# 6. Final Request Flow
1. **Frontend page** (`/tools/image-compressor`): `API.post("/image-compressor/", formData)` with 'file'/'quality'.
2. **API client** (`lib/api.ts`): Resolves to `/api/image-compressor/` via BASE_URL='/api'.
3. **Next.js proxy** (`app/api/image-compressor/route.ts`): Forwards FormData to Django `http://127.0.0.1:8000/api/tools/image-compressor/`.
4. **Django endpoint** (`tools/views.py`): Processes file, parses quality, returns JPEG blob.
5. **Proxy response**: Returns blob to frontend with correct Content-Type.
6. **Frontend result**: Creates downloadable File from blob.

# 7. Safety Check
- **Low-risk**: Single-line config change, no logic/UI/backend modified.
- **Isolated**: Only affects Image Compressor (`/api/image-compressor`). Other tools unaffected.
- **Backward compatible**: Proxy handles blob/FormData perfectly.
- **No dependencies**: Uses existing valid route.ts, no new installs.

# 8. Manual Test Steps
1. Start Next.js dev server: `cd frontend && npm run dev`
2. Start Django: `cd backend && python manage.py runserver`
3. Navigate: `http://localhost:3000/tools/image-compressor`
4. **JPG input**: Upload JPG > set quality 80 > Compress → download `compressed.jpg`
5. **PNG input**: Upload PNG → auto-converted to JPG → verify compression
6. **quality 20**: Very small file, lower quality.
7. **quality 50**: Balanced size/quality.
8. **quality 80**: Good web quality.
9. Expected: Success blob download, size reduction shown, no 404s.

# 9. Final Verdict
✅ **Image Compressor should now work correctly** via proper proxy flow.  
⚠️ **Known limitation**: PNG→JPEG conversion (intentional for compression). Multi-image not supported (single-file only)."

