# Weather Mapper

A full-stack TypeScript application for tracking weather across multiple cities with an interactive map interface.

## Overview

Weather Mapper allows users to add cities to their watchlist, view them on an interactive map, and monitor current weather conditions along with historical weather data. Perfect for travelers, weather enthusiasts, or anyone who wants to keep an eye on weather conditions in multiple locations.

## Key Features

### 🗺️ Interactive Map View
- Visualize all tracked cities on an interactive map
- Click markers to view weather details
- Search and add new cities directly from the map

### 🌤️ Weather Tracking
- Current weather conditions for each city
- Historical weather data with temperature charts
- Weather metrics: temperature, humidity, wind speed, pressure
- Weather alerts and forecasts

### 📍 City Management
- Add cities by name with automatic geocoding
- Mark favorite cities for quick access
- Add personal notes to each location
- View all cities in a searchable list

### 📊 Data Visualization
- Temperature history charts (last 7 days)
- Visual weather condition indicators
- Historical data trends

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + Node.js
- **Database**: Supabase (PostgreSQL)
- **Weather API**: OpenWeatherMap One Call API 3.0
- **Maps**: Leaflet (OpenStreetMap)

## Quick Start (Local Development)

### Prerequisites

- **Node.js 18+** installed
- **Docker Desktop** installed and running
- **OpenWeatherMap API key** - Get free key at https://openweathermap.org/api (1,000 calls/day free)

### Step 0: Verify Prerequisites

Before starting, make sure Docker and Node.js are installed:

```bash
# Check Node.js version (should be 18 or higher)
node --version

# Check npm version
npm --version

# Check Docker version
docker --version

# Check Docker is running
docker ps
```

If any of these commands fail:
- **Node.js**: Download from https://nodejs.org/ (LTS version recommended)
- **Docker Desktop**: Download from https://www.docker.com/products/docker-desktop/

Make sure Docker Desktop is running before proceeding.

### Step 1: Start Local Supabase Database

```bash
cd supabase
npx supabase start
```

This will start a local Supabase instance with Docker. Once started, you'll see output with important values:
- **API URL**: `http://127.0.0.1:54321`
- **Publishable key** or **anon key**: The key you need (typically starts with `eyJ...` or `sb_publishable_...`)

The database migrations will run automatically from `supabase/migrations/`.

> **Note**: Use the key labeled as "Publishable key" or "anon key" in the output. This is typically a JWT that starts with `eyJ...`

### Step 2: Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```bash
# Supabase Configuration (from supabase start output)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJ...your_anon_key_here

# Weather API Configuration
WEATHER_API_KEY=your_openweathermap_api_key
WEATHER_API_URL=https://api.openweathermap.org

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Server Configuration
PORT=3000
```

**Important**: 
- Replace `SUPABASE_ANON_KEY` with the actual "Publishable key" from `supabase start` output (starts with `eyJ...` or `sb_publishable_...`)
- Replace `WEATHER_API_KEY` with your actual OpenWeatherMap API key

Start the backend server:
```bash
npm run dev
```

Backend will run on **http://localhost:3000**

### Step 3: Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```bash
VITE_API_URL=http://localhost:3000
```

Start the frontend server:
```bash
npm run dev
```

Frontend will run on **http://localhost:5173**

### Step 4: Open the App

Navigate to **http://localhost:5173** in your browser and start adding cities!

---

## Quick Start (Production - Cloud Supabase)

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works) - https://supabase.com
- OpenWeatherMap API key

### Database Setup

1. Create a Supabase project at https://supabase.com
2. In the Supabase dashboard, go to the SQL Editor
3. Run the migration SQL from `supabase/migrations/20251112013843_initial_schema.sql`
4. Get your project URL and anon key from Project Settings → API

### Backend Setup

Follow Step 2 above, but use your cloud Supabase credentials:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key
```

### Frontend Setup

Follow Step 3 above.

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Requirements

**For Local Development:**
- Node.js 18+
- Docker Desktop (for local Supabase)
- OpenWeatherMap API key (free tier: 1,000 calls/day)

**For Production:**
- Node.js 18+
- Supabase cloud account (free tier works)
- OpenWeatherMap API key (free tier: 1,000 calls/day)

## Project Structure

```
weather_mapper/
├── backend/          # Express API server
├── frontend/         # React application
├── plan/            # Architecture & design docs
└── .cursor/rules/   # Development guidelines
```

## Documentation

- [Architecture Plan](./plan/architecture-plan.md)
- [Database Schema](./plan/database-schema.md)
- [API Design](.cursor/rules/04-api-design.mdc)

