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

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- OpenWeatherMap API key with "One Call by Call" subscription (1,000 calls/day free)

### Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the migration SQL from `backend/migrations/001_initial_schema.sql` in your Supabase SQL editor
3. Note your Supabase URL and anon key from the project settings

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `WEATHER_API_KEY` - Your OpenWeatherMap API key
   - `CORS_ORIGIN` - Frontend URL (default: http://localhost:5173)

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Backend will run on http://localhost:3000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file:
   ```bash
   VITE_API_URL=http://localhost:3000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on http://localhost:5173

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

- Node.js 18+
- Supabase account (free tier works)
- OpenWeatherMap API key with "One Call by Call" subscription (1,000 calls/day free)

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

