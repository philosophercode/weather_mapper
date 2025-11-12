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

1. **Setup Environment**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Fill in your API keys

   # Frontend
   cd frontend
   cp .env.example .env
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd frontend && npm install
   ```

3. **Run Development Servers**
   ```bash
   # Backend (port 3000)
   cd backend && npm run dev

   # Frontend (port 5173)
   cd frontend && npm run dev
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

