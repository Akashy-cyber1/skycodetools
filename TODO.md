# Blog Server Fetch Fallback Fix
Status: Fixing server-side URL parsing

## Root Cause Confirmed:
Server-side `fetch('/api/blog/posts/')` → `ERR_INVALID_URL` → catch → fallback length 3

## Steps:
1. ✅ Analyzed files & logs
2. ✅ Confirmed proxy works (curl length 2)
3. ✅ Edit frontend/lib/api/blog.ts: server/client URL detection (getApiUrl + safe mapping)
4. [ ] Test: length 2 real posts, no fallback, no URL error
5. [ ] Complete
