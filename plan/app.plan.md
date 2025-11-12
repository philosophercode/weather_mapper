# Weather Mapper - Implementation Plan

## Overview

Build a full-stack TypeScript application for tracking weather across multiple cities with an interactive map interface. The project follows a three-tier architecture: React frontend, Express backend, and Supabase PostgreSQL database.

## Phase 1: Project Setup & Infrastructure

### 1.1 Backend Setup

- Initialize Express + TypeScript project in `backend/`
- Configure ES modules (`"type": "module"` in package.json)
- Set up TypeScript with strict mode
- Configure build scripts (dev, build, start)
- Set up environment variables (.env.example, .env)
- Install core dependencies: express, @supabase/supabase-js, zod, axios, cors, dotenv
- Create basic Express app structure with middleware (CORS, JSON parser, error handler)

**Files to create:**

- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.env.example`
- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/src/middleware/error-handler.ts`
- `backend/src/middleware/cors.ts`

### 1.2 Frontend Setup

- Initialize React + Vite + TypeScript project in `frontend/`
- Configure Tailwind CSS
- Set up shadcn/ui components
- Configure React Router
- Set up TanStack Query (React Query)
- Install Leaflet and React-Leaflet for maps
- Install Recharts or Chart.js for data visualization
- Set up environment variables (.env.example, .env)
- Create basic app structure with routing

**Files to create:**

- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/vite.config.ts`
- `frontend/tailwind.config.js`
- `frontend/.env.example`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/services/api.ts` (API client)

### 1.3 Database Setup

- Create Supabase project (or configure local PostgreSQL)
- Run database migration SQL from [database-schema.md](plan/database-schema.md)
- Create tables: `weather_spots`, `weather_records`
- Set up indexes and triggers
- Configure Supabase client in backend
- Test database connection

**Files to create:**

- `backend/src/utils/supabase.ts`
- `backend/migrations/001_initial_schema.sql` (optional, for version control)

## Phase 2: Backend API Implementation

### 2.1 Type Definitions

- Create TypeScript types matching database schema
- Define API request/response types
- Create Zod schemas for validation

**Files to create:**

- `backend/src/types/spots.types.ts`
- `backend/src/types/weather.types.ts`
- `backend/src/types/api.types.ts`

### 2.2 Database Service Layer

- Implement database operations for weather spots
- Implement database operations for weather records
- Add helper functions for common queries (latest weather, history, etc.)

**Files to create:**

- `backend/src/services/db.service.ts`

### 2.3 Weather API Integration

- Set up OpenWeatherMap API client
- Implement One Call API 3.0 integration (primary)
- Implement API 2.5 fallback (optional)
- Implement Geocoding API for city search
- Map API responses to database schema
- Implement caching logic (10-minute cache)
- Add error handling and retry logic

**Files to create:**

- `backend/src/services/weather.service.ts`
- `backend/src/utils/weather-api.ts`

### 2.4 Business Logic Services

- Implement spots service (CRUD operations)
- Implement weather service (fetch, cache, history)
- Add validation using Zod schemas

**Files to create:**

- `backend/src/services/spots.service.ts`
- `backend/src/services/weather.service.ts`

### 2.5 API Routes

- Implement spots routes: GET, POST, GET/:id, PATCH/:id, DELETE/:id
- Implement weather routes: GET/:id/weather, POST/:id/weather, GET/:id/history
- Implement batch weather endpoint: GET /api/weather/batch
- Add request validation middleware
- Add error handling

**Files to create:**

- `backend/src/routes/spots.routes.ts`
- `backend/src/routes/weather.routes.ts`
- `backend/src/middleware/validator.ts`

### 2.6 API Testing

- Test all endpoints with sample data
- Verify error handling
- Test rate limiting and caching

## Phase 3: Frontend Implementation

### 3.1 Type Definitions & API Client

- Create TypeScript types matching backend API
- Set up API client with React Query
- Implement hooks for spots and weather data

**Files to create:**

- `frontend/src/types/spots.types.ts`
- `frontend/src/types/weather.types.ts`
- `frontend/src/types/api.types.ts`
- `frontend/src/hooks/useSpots.ts`
- `frontend/src/hooks/useWeather.ts`

### 3.2 Layout & Navigation

- Create main layout component with header
- Implement navigation between pages
- Add responsive design

**Files to create:**

- `frontend/src/components/layout/Layout.tsx`
- `frontend/src/components/layout/Header.tsx`

### 3.3 Map View (Home Page)

- Set up Leaflet map component
- Display all weather spots as markers
- Show weather icons/temperature on markers
- Implement marker click to view details
- Add map controls (zoom, location)
- Add search overlay for adding cities
- Fetch batch weather data on load

**Files to create:**

- `frontend/src/pages/MapPage.tsx`
- `frontend/src/components/map/MapView.tsx`
- `frontend/src/components/map/CityMarker.tsx`
- `frontend/src/components/map/MapControls.tsx`
- `frontend/src/components/map/SearchOverlay.tsx`

### 3.4 Add City Page

- Create form with city search/autocomplete
- Use Geocoding API for city suggestions
- Add country selector (optional)
- Add notes textarea
- Add favorite checkbox
- Add city preview
- Implement form submission with validation

**Files to create:**

- `frontend/src/pages/AddCityPage.tsx`
- `frontend/src/components/cities/AddCityForm.tsx`
- `frontend/src/components/cities/CitySearch.tsx`
- `frontend/src/components/cities/CityPreview.tsx`

### 3.5 City Detail Page

- Display current weather card
- Show weather metrics grid (temperature, humidity, wind, pressure)
- Display temperature history chart (last 7 days)
- Add notes editor
- Add delete button
- Implement refresh weather action

**Files to create:**

- `frontend/src/pages/CityDetailPage.tsx`
- `frontend/src/components/weather/WeatherCard.tsx`
- `frontend/src/components/weather/WeatherMetrics.tsx`
- `frontend/src/components/weather/WeatherHistoryChart.tsx`
- `frontend/src/components/cities/NotesEditor.tsx`

### 3.6 City List Page

- Create table/list view of all cities
- Add search/filter functionality
- Make columns sortable
- Add favorite toggle
- Link to city detail page

**Files to create:**

- `frontend/src/pages/CityListPage.tsx`
- `frontend/src/components/cities/CityList.tsx`
- `frontend/src/components/cities/CityRow.tsx`

### 3.7 UI Components (shadcn/ui)

- Install and configure shadcn/ui components
- Create reusable UI components as needed
- Style components with Tailwind CSS

**Files to create:**

- `frontend/src/components/ui/` (shadcn components)

## Phase 4: Integration & Polish

### 4.1 Error Handling

- Implement error boundaries in React
- Add user-friendly error messages
- Add loading states throughout UI
- Handle API errors gracefully

### 4.2 Performance Optimization

- Implement React Query caching strategies
- Add code splitting for map components
- Optimize image loading
- Add debouncing for search inputs
- Implement optimistic updates

### 4.3 Testing

- Write unit tests for services
- Write integration tests for API endpoints
- Test frontend components (optional)

### 4.4 Documentation

- Update README with setup instructions
- Document environment variables
- Add API documentation (optional)

## Phase 5: Deployment Preparation

### 5.1 Environment Configuration

- Set up production environment variables
- Configure CORS for production domains
- Set up build scripts

### 5.2 Deployment

- Deploy backend to Railway/Render/Fly.io
- Deploy frontend to Vercel/Netlify
- Configure environment variables in hosting platforms
- Test production deployment

## Key Implementation Details

### Database Schema

Follow the schema defined in [database-schema.md](plan/database-schema.md):

- `weather_spots` table with UUID primary keys
- `weather_records` table with foreign key to spots
- Proper indexes for performance

### API Endpoints

Follow the API design in [04-api-design.mdc](.cursor/rules/04-api-design.mdc):

- RESTful endpoints with proper HTTP methods
- Consistent JSON response format
- Zod validation on all inputs

### Weather API Integration

Follow guidelines in [06-weather-api.mdc](.cursor/rules/06-weather-api.mdc):

- Use One Call API 3.0 as primary API
- Implement 10-minute caching
- Handle rate limits and errors gracefully
- Map API responses to database schema correctly

### Frontend Features

Follow [07-frontend-features.mdc](.cursor/rules/07-frontend-features.mdc):

- Use React Query for server state
- Implement all pages from wireframes
- Use Leaflet for maps, Recharts/Chart.js for charts
- Follow mobile-first responsive design

## Dependencies Summary

### Backend

- express, @types/express
- @supabase/supabase-js
- zod
- axios
- cors, dotenv
- typescript, ts-node, nodemon

### Frontend

- react, react-dom
- react-router-dom
- @tanstack/react-query
- leaflet, react-leaflet
- recharts or chart.js
- tailwindcss
- shadcn/ui components
- typescript, vite

## Success Criteria

- All API endpoints working correctly
- Map view displays all cities with weather markers
- Users can add cities with search/autocomplete
- Weather data displays correctly with charts
- Historical data shows last 7 days
- Favorites and notes functionality works
- Responsive design works on mobile and desktop
- Error handling provides user-friendly messages
- Application deployed and accessible