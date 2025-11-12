# Database Setup Guide

## Supabase Database Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in (or create an account)
2. Click "New Project"
3. Fill in:
   - **Name**: weather-mapper (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to you
   - Click "Create new project"

### Step 2: Run Migration SQL

1. Once your project is created, go to the **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy and paste the entire contents of `backend/migrations/001_initial_schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

### Step 3: Get Connection Details

1. Go to **Settings** → **API** in the left sidebar
2. Copy the following values:
   - **Project URL** (this is your `SUPABASE_URL`)
   - **anon/public key** (this is your `SUPABASE_ANON_KEY`)

### Step 4: Update Backend .env File

1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and replace the placeholder values:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 5: Verify Setup

1. Restart your backend server if it's running
2. Check the backend logs - it should connect successfully
3. Test the API: `curl http://localhost:3000/health`

## Database Schema

The migration creates:
- `weather_spots` table - stores city/location data
- `weather_records` table - stores historical weather data
- Indexes for performance
- Trigger for automatic `updated_at` timestamp

## Troubleshooting

- **Connection errors**: Double-check your SUPABASE_URL and SUPABASE_ANON_KEY
- **Migration errors**: Make sure you're running the SQL in the Supabase SQL Editor
- **Permission errors**: Ensure you're using the `anon` key, not the `service_role` key

