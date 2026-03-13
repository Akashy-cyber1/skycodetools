# 1. Tools System Overview

The tools system provides a full-stack implementation for online file processing utilities (PDF manipulation, image processing). 

**Purpose**: Frontend Next.js tool pages collect user file uploads, frontend API routes (`/api/[tool]/route.ts`) proxy POST requests with FormData to Django backend at `/api/tools/[tool]/`, backend processes files (PyPDF2, PIL/rembg, ReportLab) and returns binary blobs (PDF/image). 

**Organization**: 
- Frontend: `/app/tools/[slug]/page.tsx` (UI/upload), `/app/api/[tool]/route.ts` (proxies)
- Backend: `/tools/views.py` (handlers return HttpResponse blobs), `/tools/urls.py` (custom paths), main `/api/` prefix via `skycodetools/urls.py`

**Request Flow**: User drag-drop → FormData (e.g. `files[]`, `file`, `quality`) → fetch(`/api/[tool]/`) → Next.js proxy fetch(`${BACKEND_URL}/api/tools/[tool]/`, FormData) → Django handler → blob response → frontend URL.createObjectURL(blob)

**Modularity**: Yes - config-driven (`frontend/config/tools.ts`), similar proxy patterns, extensible via new `/app/api/*` + `/tools/views.py` + urls.py entry.

# 2. Tool-Related Folder Structure

**Frontend tool pages**:
- `frontend/app/tools/background-remover/page.tsx`
- `frontend/app/tools/image-compressor/page.tsx`
- `frontend/app/tools/image-to-pdf/page.tsx`
- `frontend/app/tools/merge-pdf/page.tsx`
- `frontend/app/tools/split-pdf/page.tsx`

**Frontend API/proxy routes**:
- `frontend/app/api/background-remover/route.ts`
- `frontend/app/api/image-compressor/route.ts`
- `frontend/app/api/image-to-pdf/route.ts`
- `frontend/app/api/merge-pdf/route.ts`
- `frontend/app/api/split-pdf/route.ts`

**Shared frontend helpers**:
- `frontend/config/tools.ts` (tool configs w/ apiEndpoint: `/api/[tool]/`)
- `frontend/hooks/useFileUpload.ts`
- `frontend/types/api.ts`, `frontend/types/tool.ts`

**Backend tool app/files**:
- `backend/tools/views.py` (main handlers)
- `backend/tools/views_fixed.py`, `backend/tools/views_backup_before_rembg.py` (backups)
- `backend/tools/urls.py`
- `backend/tools/models.py`, `backend/tools/serializers.py`

**Backend urls/views/services**:
- `backend/skycodetools/urls.py` (`path('api/', include('tools.urls'))`)
- `backend/tools/urls.py` (custom paths e.g. `path('split-pdf/', split_pdf)`)

**Env/config**:
- `backend/skycodetools/settings.py` (CORS_ALLOWED_ORIGINS, REMOVE_BG_API_KEY, ALLOWED_HOSTS)

# 3. Tool Inventory

| Tool Name          | Frontend Page File                  | Frontend API Route File       | Backend Endpoint              | Backend View/Handler File     | Status              |
|--------------------|-------------------------------------|-------------------------------|-------------------------------|-------------------------------|---------------------|
| Image to PDF      | `/app/tools/image-to-pdf/page.tsx` | `/app/api/image-to-pdf/route.ts` | `/api/tools/image-to-pdf/`   | `backend/tools/views.py`     | Exists but not working |
| Merge PDF         | `/app/tools/merge-pdf/page.tsx`    | `/app/api/merge-pdf/route.ts`     | `/api/tools/merge-pdf/`      | `backend/tools/views.py`     | Exists but not working |
| Split PDF         | `/app/tools/split-pdf/page.tsx`    | `/app/api/split-pdf/route.ts`     | `/api/tools/split-pdf/`      | `backend/tools/views.py`     | Exists but not working |
| Image Compressor  | `/app/tools/image-compressor/page.tsx` | `/app/api/image-compressor/route.ts` | `/api/tools/image-compressor/` | `backend/tools/views.py`  | Exists but not working |
| Background Remover| `/app/tools/background-remover/page.tsx` | `/app/api/background-remover/route.ts` | `/api/tools/background-remover/` | `backend/tools/views.py` | Partial implementation |

# 4. Best Working Tool Reference

**Background Remover** (most complete local impl using rembg/PIL, no external API dep).

**Full Flow**:
- **Page**: `frontend/app/tools/background-remover/page.tsx` - Drag-drop single image (`file` FormData), fetch("/api/background-remover/", {method:"POST", body:formData}), expect blob, `URL.createObjectURL(blob)`
- **Upload**: Validates image types, FormData.append("file", file)
- **Proxy**: `/app/api/background-remover/route.ts` - NextRequest.formData() → fetch(`${BACKEND_URL}/api/tools/background-remover/`, {method:"POST", body:formData}) → return blob (Content-Type:application/pdf? No, image/png)
- **Backend Endpoint**: `/api/tools/background-remover/` via `skycodetools/urls.py` → `tools/urls.py` → `views.py:background_remover`
- **Handler**: `backend/tools/views.py` - Gets `request.FILES.get("file")` or lists, validates types/size(10MB), rembg.remove(input_bytes), HttpResponse(png_bytes, content_type='image/png'), filename="removed_bg.png"
- **Response**: Binary PNG blob
- **Download**: Frontend creates object URL, user downloads

# 5. Broken Tools Analysis

**Image to PDF**:
- Frontend: `formData.append("files", image.file)` multiple
- API: forwards FormData
- Backend: `/api/tools/image-to-pdf/` expects `getlist('files') or getlist('images')`, uses ReportLab canvas
- Current code: Complete impl returns PDF HttpResponse
- Mismatch: Likely works; test needed. Proxy assumes PDF but handles generic blob.

**Merge PDF**:
- Frontend: `formData.append('files', f.file)` multiple
- Backend: `getlist('files') or getlist('pdfs')`, PyPDF2.PdfMerger, returns merged.pdf
- Mismatch: None visible; complete.

**Split PDF**:
- Frontend page: `formData.append("file", file.file); formData.append("page_ranges", pageRanges)` via Axios responseType:"blob"
- Proxy: Generic FormData forward, returns blob w/ Content-Type:application/pdf
- Backend: Only `get('file')`, no "page_ranges" handling, simplistic first-page extract
- Mismatch: **Backend ignores page_ranges, always returns page 1**; frontend sends but unused.

**Image Compressor**:
- Frontend: `formData.append("file", imageFile.file); formData.append("quality", quality)`
- Backend: `getlist(...)`, takes first, PIL save JPEG w/ quality param
- Mismatch: **Frontend sends "quality" but backend uses request.data.get('quality',80) which fails on FormData** (files override).

# 6. Tool Request/Response Contract

| Tool              | Method | Payload Type    | Form-data Keys          | Files     | Frontend Expect | Backend Actual     | Mismatch              |
|-------------------|--------|-----------------|------------------------|-----------|-----------------|-------------------|-----------------------|
| Image to PDF     | POST  | FormData       | files/images/image/file| Multiple | blob (PDF)     | HttpResponse PDF  | None visible         |
| Merge PDF        | POST  | FormData       | files/pdfs/pdf        | Multiple | blob (PDF)     | HttpResponse PDF  | None visible         |
| Split PDF        | POST  | FormData       | file, page_ranges     | Single   | blob (PDF)     | HttpResponse PDF (page1 only) | page_ranges ignored |
| Img Compressor   | POST  | FormData       | file, quality         | Single   | blob (JPEG)    | HttpResponse JPEG | quality param fail  |
| Bg Remover       | POST  | FormData       | file/image/files[0]   | Single   | blob (PNG)     | HttpResponse PNG  | None visible         |

# 7. Endpoint Mapping Table

| Tool Name        | Frontend Trigger File              | Calls URL              | Proxy or Direct | Backend Final URL              | Method | Payload Type | Expected Response |
|------------------|------------------------------------|------------------------|-----------------|-------------------------------|--------|--------------|-------------------|
| Image to PDF    | `/tools/image-to-pdf/page.tsx`    | `/api/image-to-pdf/`  | Proxy          | `${BACKEND_URL}/api/tools/image-to-pdf/` | POST  | FormData    | PDF blob         |
| Merge PDF       | `/tools/merge-pdf/page.tsx`       | `/api/merge-pdf/`     | Proxy          | `${BACKEND_URL}/api/tools/merge-pdf/`   | POST  | FormData    | PDF blob         |
| Split PDF       | `/tools/split-pdf/page.tsx`       | `/api/split-pdf/`     | Proxy          | `${BACKEND_URL}/api/tools/split-pdf/`   | POST  | FormData    | PDF blob         |
| Img Compressor  | `/tools/image-compressor/page.tsx`| `/api/image-compressor/` | Proxy        | `${BACKEND_URL}/api/tools/image-compressor/` | POST | FormData   | JPEG blob        |
| Bg Remover      | `/tools/background-remover/page.tsx` | `/api/background-remover/` | Proxy      | `${BACKEND_URL}/api/tools/background-remover/` | POST | FormData  | PNG blob         |

# 8. Config and Env Used by Tools

**Frontend**:
- `NEXT_PUBLIC_BACKEND_URL` (proxy fallback "http://127.0.0.1:8000") in `/app/api/[tool]/route.ts`

**Backend**:
- `ALLOWED_HOSTS` (env split, dev: localhost/127.0.0.1/.onrender.com)
- `CORS_ALLOWED_ORIGINS` (env split, dev: http://localhost:3000/127.0.0.1:3000)
- `REMOVE_BG_API_KEY` (bg remover, unused in active local impl)
- `DEBUG` (affects error display/security)

No upload-specific MEDIA_URL visible in tools (in-memory BytesIO).

# 9. Most Likely Failure Points

1. **FormData param access**: Split-pdf frontend sends "page_ranges" (ignored); compressor "quality" via request.data (fails on multipart).
2. **Blob handling**: Proxies generic blob but set PDF Content-Type; browser expects match.
3. **CORS/Backend URL**: NEXT_PUBLIC_BACKEND_URL mismatch (localhost:8000 vs deployed).
4. **File key mismatch**: Backend flexible getlist('files'/'images'), but split expects single 'file'.
5. **Missing deps**: PyPDF2, rembg, reportlab (requirements.txt confirms).
6. **Split-pdf logic**: Only extracts page 1, ignores ranges.

# 10. Safe Fix Order

1. Keep **Background Remover** untouched (reference impl).
2. Fix **Image Compressor** (add quality=request.POST.get('quality',80); parse FormData).
3. Fix **Split PDF** (implement page_ranges parsing w/ PyPDF2 slicing).
4. Test **Merge PDF/Image-to-PDF** (likely minor).
5. Deploy/test CORS/BACKEND_URL.

# 11. Priority Files for ChatGPT Review

- `backend/tools/views.py` - All tool handlers, param access, logic impls.
- `backend/tools/urls.py` - Endpoint paths confirmed active (not commented).
- `frontend/app/api/split-pdf/route.ts` - Proxy pattern (all similar).
- `backend/tools/views.py:split_pdf` - Incomplete page_ranges handling.
- `frontend/config/tools.ts` - Centralized endpoints/UI config.
- `backend/skycodetools/settings.py` - CORS/hosts critical for proxy.

# 12. Unknowns

- Actual runtime status (no tests/logs; assumes code=working).
- `requirements.txt` deps installed (PyPDF2/PIL/reportlab/rembg).
- Deployed BACKEND_URL/CORS config.
- Split-pdf full page_ranges parsing impl details (code simplistic).
- Frontend Axios (`@/lib/api`) vs native fetch consistency.

