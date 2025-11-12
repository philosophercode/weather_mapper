# Deployment Guide

This guide covers deploying the Weather Mapper application to production.

## Backend Deployment

### Option 1: Railway

1. **Create Railway account** and create a new project
2. **Connect your repository** or deploy from GitHub
3. **Set environment variables** in Railway dashboard:
   - `PORT` (Railway sets this automatically)
   - `NODE_ENV=production`
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `WEATHER_API_KEY` - Your OpenWeatherMap API key
   - `CORS_ORIGIN` - Your frontend URL (e.g., https://your-app.vercel.app)
4. **Set build command**: `cd backend && npm install && npm run build`
5. **Set start command**: `cd backend && npm start`
6. **Deploy** - Railway will automatically deploy on push

### Option 2: Render

1. **Create Render account** and create a new Web Service
2. **Connect your repository**
3. **Configure service**:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment: Node
4. **Set environment variables** in Render dashboard (same as Railway)
5. **Deploy**

### Option 3: Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Create app**: `fly apps create weather-mapper-backend`
4. **Set secrets**:
   ```bash
   fly secrets set SUPABASE_URL=your_url
   fly secrets set SUPABASE_ANON_KEY=your_key
   fly secrets set WEATHER_API_KEY=your_key
   fly secrets set CORS_ORIGIN=your_frontend_url
   fly secrets set NODE_ENV=production
   ```
5. **Deploy**: `fly deploy`

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Create Vercel account** and import your repository
2. **Configure project**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Set environment variables**:
   - `VITE_API_URL` - Your backend URL (e.g., https://your-backend.railway.app)
4. **Deploy** - Vercel will automatically deploy on push

### Option 2: Netlify

1. **Create Netlify account** and import your repository
2. **Configure build settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. **Set environment variables** in Site settings:
   - `VITE_API_URL` - Your backend URL
4. **Deploy**

## Environment Variables Summary

### Backend (.env)
```
PORT=3000
NODE_ENV=production
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
WEATHER_API_KEY=xxx
WEATHER_API_URL=https://api.openweathermap.org
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.railway.app
```

## Post-Deployment Checklist

- [ ] Backend health check endpoint responds: `https://your-backend.railway.app/health`
- [ ] Frontend loads without errors
- [ ] API calls work from frontend (check browser console)
- [ ] Database connection works (test adding a city)
- [ ] Weather API integration works (test fetching weather)
- [ ] CORS is configured correctly
- [ ] Environment variables are set correctly

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` in backend matches your frontend URL exactly
- Check that backend allows requests from frontend domain

### Database Connection Issues
- Verify Supabase URL and anon key are correct
- Check Supabase project is active and not paused
- Ensure database migration has been run

### Weather API Issues
- Verify OpenWeatherMap API key is valid
- Check API key has "One Call by Call" subscription enabled
- Monitor API usage to avoid rate limits

### Build Failures
- Ensure Node.js version matches (18+)
- Check all dependencies are installed
- Verify TypeScript compilation succeeds locally first

