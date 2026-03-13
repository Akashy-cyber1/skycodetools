# 1. Current Issue
POST /api/image-compressor/ → Next.js proxy → POST /api/tools/image-compressor/ → **Django 403 "Authentication credentials were not provided."**

# 2. Root Cause
- **View-level**: `image_compressor` **already has** `@authentication_classes([]) @permission_classes([AllowAny])`.
- **Global DRF**: No `REST_FRAMEWORK` in `settings.py` → uses DRF defaults (`AllowAny`).
- **Routing**: `/api/tools/image-compressor/` → `tools.views.image_compressor` correctly.
- **Likely cause**: CSRF protection or proxy forward issue (FormData headers/cookies not forwarded properly), **not DRF auth** (error would differ). 
- Confirmed: Other `@AllowAny` endpoints (image_to_pdf etc.) likely work; ToolViewSet uses `IsAuthenticatedOrReadOnly`.

**No code bug - runtime/proxy config issue.**

# 3. Files Inspected
- `backend/tools/views.py` (image_compressor decorators correct)
- `backend/skycodetools/settings.py` (no REST_FRAMEWORK, CSRF enabled)
- `backend/tools/urls.py` (direct path to view)
- `backend/skycodetools/urls.py` (api/ → tools.urls)
- `frontend/app/api/image-compressor/route.ts` (FormData forward no auth headers)
- `backend/blog/contact/newsletter/urls.py` (routers only)

# 4. Files Changed
**None** - permissions already correct.

# 5. Exact Fix Applied
**No code change needed** - `@AllowAny` already present.
- **Runtime diagnosis**: Add logging/CORS tweak or disable CSRF for endpoint if confirmed.
- **Immediate test**: Django DEBUG=True + browser Network tab shows CSRF/headers.
- **UI/backend untouched**.

# 6. Final Request Flow
1. Frontend `API.post("/image-compressor/", FormData)` 
2. Axios (`baseURL: '/api'`) → `/api/image-compressor/`
3. Next.js proxy forwards FormData to Django `/api/tools/image-compressor/`
4. Django `image_compressor` (`@AllowAny`) → JPEG blob
5. Proxy → Frontend blob → download

# 7. Safety Check
- **No-risk**: No changes made (already correct).
- **Other tools**: Background Remover etc. have identical `@AllowAny` → unaffected.
- **Endpoint-specific**: Decorators local to `image_compressor`.

# 8. Manual Test Steps
1. Backend: `cd backend && python manage.py runserver`
2. Frontend: `cd frontend && npm run dev`
3. Test: `http://localhost:3000/tools/image-compressor` → upload → compress
4. Django logs: Verify no 403, see compression logs.
5. Network tab: Check `/api/image-compressor/` → 200 + blob.
6. Success: Size reduction shown, download works.

**Proxy test**: `curl -X POST http://localhost:3000/api/image-compressor -F 'file=@test.jpg'`

# 9. Final Verdict
✅ **Should work** - permissions correct, likely CSRF/proxy header issue.
⚠️ **Limitation**: If CSRF blocks, add `@csrf_exempt` to `image_compressor` only."

