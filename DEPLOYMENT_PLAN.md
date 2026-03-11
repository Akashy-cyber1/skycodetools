# SkyCode Tools - Deployment Plan

## 1. Project Structure & Deployment Architecture

### What Goes Where:
| Component | Platform | Purpose |
|-----------|----------|---------|
| Frontend (Next.js 14) | Vercel | Hosting static pages and API proxy routes |
| Backend (Django) | Render Web Service | Running Python/Django API |
| Database | Render PostgreSQL or Neon | PostgreSQL database |
| remove.bg API | External | Background removal service |

### Architecture Flow:
```
User Browser
    ↓
Vercel (Frontend + API Routes)
    ↓ (proxy)
Render (Django Backend)
    ↓ (API call)
remove.bg (External API)
```

---

## 2. Files Created/Updated

### Created:
- `backend/.env.example` - Environment variables template
- `backend/Procfile` - Render deployment configuration
- `frontend/.env.example` - Frontend environment template
- `frontend/.env.production` - Frontend production environment

### Updated:
- `backend/skycodetools/settings.py` - Production-ready Django settings
- `backend/requirements.txt` - Added dj-database-url
- `.gitignore` - Enhanced for production

---

## 3. Pre-Deployment Checklist

- [ ] Generate a strong Django SECRET_KEY
- [ ] Create Render PostgreSQL database
- [ ] Get remove.bg API key (https://www.remove.bg/api)
- [ ] Push code to GitHub

---

## 4. Backend Deployment (Render)

### Step 1: Create Render Account & Connect GitHub
1. Go to https://render.com and sign up with GitHub
2. Click "New" → "Web Service"
3. Select your GitHub repository

### Step 2: Configure Backend Settings

| Setting | Value |
|---------|-------|
| Name | skycode-tools-backend |
| Root Directory | backend |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn skycodetools.wsgi:application --bind 0.0.0.0:$PORT` |

### Step 3: Environment Variables (Render Dashboard)

Add these environment variables in Render:

```
DJANGO_SECRET_KEY=<generate-strong-key>
DEBUG=False
ALLOWED_HOSTS=your-backend.onrender.com
DATABASE_URL=<from-render-postgres>
REMOVE_BG_API_KEY=<your-api-key>
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app
```

**To generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for build to complete
3. Note your backend URL: `https://your-backend.onrender.com`

---

## 5. Frontend Deployment (Vercel)

### Step 1: Create Vercel Account & Import Project
1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New..." → "Project"
3. Select your GitHub repository

### Step 2: Configure Frontend Settings

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | frontend |
| Output Directory | Default (or .next) |

### Step 3: Environment Variables (Vercel Dashboard)

Add these environment variables:

```
DJANGO_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-app.vercel.app`

---

## 6. Connecting Frontend to Backend

After both deployments:

1. **Update Backend CORS** (in Render):
   - Add your Vercel URL to `CORS_ALLOWED_ORIGINS`
   - Add your Vercel URL to `CSRF_TRUSTED_ORIGINS`
   - Redeploy backend

2. **Test the Connection:**
   - Visit your Vercel frontend
   - Try a tool feature (e.g., background remover)
   - It should work via the API proxy

---

## 7. Environment Variables Summary

### Backend (Render):
```bash
DJANGO_SECRET_KEY=<generated-secret-key>
DEBUG=False
ALLOWED_HOSTS=backend-name.onrender.com
DATABASE_URL=postgres://user:password@host:port/dbname
REMOVE_BG_API_KEY=your-api-key
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel):
```bash
DJANGO_API_URL=https://backend-name.onrender.com
NEXT_PUBLIC_API_URL=https://backend-name.onrender.com
```

---

## 8. Final Testing Checklist

- [ ] Backend health check: Visit `https://your-backend.onrender.com/`
- [ ] Backend admin: `https://your-backend.onrender.com/admin/`
- [ ] Frontend loads: Visit `https://your-app.vercel.app`
- [ ] Background remover tool works
- [ ] Image compressor tool works
- [ ] Image to PDF tool works
- [ ] Merge PDF tool works
- [ ] Split PDF tool works
- [ ] HTTPS is enabled
- [ ] CORS is properly configured

---

## 9. Troubleshooting

### Common Issues:

1. **502 Bad Gateway**
   - Check if backend is running
   - Verify ALLOWED_HOSTS includes your Vercel domain

2. **CORS Errors**
   - Add Vercel URL to CORS_ALLOWED_ORIGINS in Django settings
   - Redeploy backend

3. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check database is running

4. **Static Files Not Loading**
   - Run `python manage.py collectstatic` on Render (or let build command handle it)

---

## 10. Commands for Local Testing

### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Edit .env with your values
python manage.py migrate
python manage.py runserver
```

### Frontend:
```bash
cd frontend
npm install
cp .env.example .env.local  # Edit with your local backend URL
npm run dev
```

