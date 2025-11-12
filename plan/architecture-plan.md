# Weather Mapper - Architecture Plan

## System Overview

Weather Mapper is a full-stack TypeScript application that enables users to track weather for multiple cities. The application follows a three-tier architecture: **Frontend (React)**, **Backend (Express API)**, and **Database (Supabase PostgreSQL)**.

### High-Level Architecture

```
┌─────────────────┐
│   React Client  │  (Frontend - Vite + TypeScript)
│   - Map View    │
│   - City List   │
│   - City Detail │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express API    │  (Backend - Node.js + TypeScript)
│  - REST Routes  │
│  - Services     │
│  - Validation   │
└────────┬────────┘
         │
    ┌────┴────┐
    │        │
┌───▼───┐ ┌──▼────────┐
│Supabase│ │Weather API│
│  (DB)  │ │(External) │
└────────┘ └───────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router
- **Maps**: Leaflet (free, open-source)
- **Charts**: Recharts or Chart.js
- **HTTP Client**: Native fetch or axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Module System**: ES Modules (`"type": "module"`)
- **Validation**: Zod for runtime validation
- **Database Client**: @supabase/supabase-js
- **HTTP Client**: axios or native fetch

### Database
- **Provider**: Supabase (PostgreSQL)
- **ORM/Client**: Supabase JavaScript Client
- **Primary Keys**: UUID
- **Timestamps**: Automatic `created_at`, `updated_at`

### External Services
- **Weather API**: OpenWeatherMap or WeatherAPI.com
- **Map Tiles**: OpenStreetMap (via Leaflet)

---

## Database Architecture

### Schema Design

#### Table: `weather_spots`
Stores user-tracked cities/locations.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `city_name` | VARCHAR | NOT NULL | City name |
| `country_code` | VARCHAR(2) | NULLABLE | ISO country code (optional) |
| `latitude` | DECIMAL(10,8) | NOT NULL | Latitude coordinate |
| `longitude` | DECIMAL(11,8) | NOT NULL | Longitude coordinate |
| `is_favorite` | BOOLEAN | DEFAULT false | Favorite flag |
| `notes` | TEXT | NULLABLE | User notes about the city |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_weather_spots_favorite` on `is_favorite`
- `idx_weather_spots_location` on `(latitude, longitude)`

#### Table: `weather_records`
Stores historical weather data for each spot.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `weather_spot_id` | UUID | FOREIGN KEY → weather_spots.id | Reference to spot |
| `temperature` | DECIMAL(5,2) | NOT NULL | Temperature value |
| `temperature_unit` | VARCHAR(1) | DEFAULT 'C' | Unit: C (Celsius) or F (Fahrenheit) |
| `condition` | VARCHAR(50) | NOT NULL | Weather condition (e.g., "Sunny", "Cloudy") |
| `humidity` | INTEGER | NULLABLE | Humidity percentage (0-100) |
| `wind_speed` | DECIMAL(5,2) | NULLABLE | Wind speed |
| `wind_direction` | INTEGER | NULLABLE | Wind direction in degrees (0-360) |
| `pressure` | DECIMAL(7,2) | NULLABLE | Atmospheric pressure (hPa) |
| `recorded_at` | TIMESTAMP | NOT NULL | When weather was recorded |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_weather_records_spot_id` on `weather_spot_id`
- `idx_weather_records_recorded_at` on `recorded_at`
- `idx_weather_records_spot_recorded` on `(weather_spot_id, recorded_at DESC)`

**Foreign Key:**
- `weather_spot_id` → `weather_spots.id` ON DELETE CASCADE

---

## API Architecture

### REST Endpoints

#### Weather Spots Management
```
GET    /api/spots              - List all weather spots
POST   /api/spots              - Add a new weather spot
GET    /api/spots/:id          - Get spot details
PATCH  /api/spots/:id          - Update spot (favorite, notes, etc.)
DELETE /api/spots/:id          - Remove a weather spot
```

#### Weather Data
```
GET    /api/spots/:id/weather  - Get current weather for a spot (from DB cache)
GET    /api/spots/:id/history  - Get weather history for a spot
POST   /api/spots/:id/weather  - Fetch fresh weather from API and save
GET    /api/weather/batch      - Get weather for all spots at once
```

### Request/Response Formats

#### Success Response
```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

#### Error Response
```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

### API Layer Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── spots.routes.ts      - Weather spots routes
│   │   └── weather.routes.ts    - Weather data routes
│   ├── services/
│   │   ├── spots.service.ts     - Business logic for spots
│   │   ├── weather.service.ts   - Weather API integration
│   │   └── db.service.ts        - Database operations
│   ├── middleware/
│   │   ├── error-handler.ts     - Error handling middleware
│   │   ├── validator.ts         - Request validation
│   │   └── cors.ts              - CORS configuration
│   ├── types/
│   │   ├── spots.types.ts       - Spot-related types
│   │   ├── weather.types.ts     - Weather-related types
│   │   └── api.types.ts         - API response types
│   ├── utils/
│   │   ├── supabase.ts         - Supabase client setup
│   │   └── logger.ts            - Logging utility
│   └── app.ts                   - Express app setup
└── server.ts                    - Entry point
```

---

## Frontend Architecture

### Page Structure (Based on Wireframes)

1. **Map View (Home)** - `/`
   - Interactive Leaflet map
   - City markers with weather icons/temps
   - Search overlay
   - Map controls (zoom, location)

2. **Add City Page** - `/cities/add`
   - City search/autocomplete
   - Country selector (optional)
   - Notes textarea
   - Favorite checkbox
   - Preview image

3. **City Detail View** - `/cities/:id`
   - Current weather display
   - Weather metrics grid
   - Temperature history chart
   - Notes editor
   - Delete button

4. **City List View** - `/cities`
   - Table/list of all cities
   - Search/filter
   - Sortable columns
   - Favorite toggle

5. **Settings Page** - `/settings` (optional, low priority)
   - User preferences
   - Theme settings

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   └── Main
│       ├── MapView (Home)
│       │   ├── LeafletMap
│       │   │   ├── CityMarker (multiple)
│       │   │   └── MapControls
│       │   └── SearchOverlay
│       ├── AddCityPage
│       │   ├── AddCityForm
│       │   │   ├── CitySearch
│       │   │   ├── CountrySelect
│       │   │   ├── NotesTextarea
│       │   │   └── FavoriteCheckbox
│       │   └── CityPreview
│       ├── CityDetailPage
│       │   ├── WeatherCard
│       │   ├── WeatherMetrics
│       │   ├── WeatherHistoryChart
│       │   └── NotesEditor
│       └── CityListPage
│           ├── CitySearch
│           └── CityTable
│               └── CityRow (multiple)
└── Router
```

### Frontend Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx
│   │   │   ├── CityMarker.tsx
│   │   │   └── MapControls.tsx
│   │   ├── weather/
│   │   │   ├── WeatherCard.tsx
│   │   │   ├── WeatherMetrics.tsx
│   │   │   └── WeatherHistoryChart.tsx
│   │   ├── cities/
│   │   │   ├── AddCityForm.tsx
│   │   │   ├── CitySearch.tsx
│   │   │   ├── CityList.tsx
│   │   │   └── CityRow.tsx
│   │   └── ui/              (shadcn/ui components)
│   ├── pages/
│   │   ├── MapPage.tsx
│   │   ├── AddCityPage.tsx
│   │   ├── CityDetailPage.tsx
│   │   ├── CityListPage.tsx
│   │   └── SettingsPage.tsx
│   ├── hooks/
│   │   ├── useSpots.ts
│   │   ├── useWeather.ts
│   │   └── useMap.ts
│   ├── services/
│   │   ├── api.ts            (API client)
│   │   └── weather.ts        (Weather API client)
│   ├── types/
│   │   ├── spots.types.ts
│   │   ├── weather.types.ts
│   │   └── api.types.ts
│   ├── utils/
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
└── public/
```

---

## Data Flow

### Adding a City
```
User Input → AddCityForm
    ↓
React Query Mutation → POST /api/spots
    ↓
Express Route → spots.routes.ts
    ↓
Validation (Zod) → spots.service.ts
    ↓
Database Insert → Supabase (weather_spots)
    ↓
Fetch Weather → Weather API
    ↓
Save Weather → Supabase (weather_records)
    ↓
Response → Frontend
    ↓
Update UI (optimistic update)
```

### Viewing Weather
```
User Clicks Marker → CityDetailPage
    ↓
React Query → GET /api/spots/:id/weather
    ↓
Express Route → weather.routes.ts
    ↓
Check Cache → weather.service.ts
    ↓
If stale → Fetch from Weather API
    ↓
Update Cache → Supabase (weather_records)
    ↓
Return Data → Frontend
    ↓
Render WeatherCard + Chart
```

### Batch Weather Update
```
Map View Loads → GET /api/weather/batch
    ↓
Express Route → weather.routes.ts
    ↓
Get All Spots → Supabase
    ↓
Check Cache Age → weather.service.ts
    ↓
Fetch Fresh Data → Weather API (parallel)
    ↓
Update Cache → Supabase (transaction)
    ↓
Return All Weather → Frontend
    ↓
Render Markers on Map
```

---

## Security Architecture

### API Security
- **CORS**: Configured for production domain
- **Input Validation**: Zod schemas on all endpoints
- **Error Handling**: No sensitive data in error messages
- **Rate Limiting**: Implement on Weather API calls
- **Environment Variables**: All secrets in `.env`

### Frontend Security
- **API Keys**: Never exposed in frontend code
- **HTTPS**: Required in production
- **Input Sanitization**: React handles XSS prevention
- **CSP**: Content Security Policy headers

---

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────┐
│         CDN / Edge              │
│    (Vercel/Netlify Edge)       │
└────────────┬──────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼────┐
│Frontend│      │ Backend │
│ Vercel │      │ Railway │
│        │      │  Render │
└────────┘      └────┬────┘
                     │
              ┌──────┴──────┐
              │             │
         ┌────▼────┐   ┌────▼────────┐
         │Supabase│   │ Weather API │
         │   DB   │   │  (External) │
         └────────┘   └─────────────┘
```

### Environment Variables

#### Backend (.env)
```
PORT=3000
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
WEATHER_API_KEY=xxx
WEATHER_API_URL=https://api.openweathermap.org
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

#### Frontend (.env)
```
VITE_API_URL=https://your-backend.railway.app
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org
```

---

## Performance Considerations

### Backend
- **Caching**: Weather data cached in database
- **Batch Operations**: Fetch weather for multiple spots in parallel
- **Database Indexes**: On frequently queried columns
- **Connection Pooling**: Handled by Supabase client

### Frontend
- **React Query**: Automatic caching and refetching
- **Code Splitting**: Lazy load map components
- **Image Optimization**: Optimize weather icons
- **Debouncing**: Search inputs debounced
- **Optimistic Updates**: Immediate UI feedback

---

## Error Handling Strategy

### Backend
- **Middleware**: Centralized error handler
- **HTTP Status Codes**: Proper status codes (200, 201, 400, 404, 500)
- **Error Logging**: Log errors for debugging
- **User-Friendly Messages**: Clear error messages

### Frontend
- **Error Boundaries**: React error boundaries
- **Loading States**: Show loading indicators
- **Error States**: Display user-friendly error messages
- **Retry Logic**: Retry failed requests

---

## Development Workflow

### Local Development
1. **Backend**: `npm run dev` (Express with nodemon)
2. **Frontend**: `npm run dev` (Vite dev server)
3. **Database**: Supabase local or cloud instance
4. **Environment**: `.env` files for configuration

### Testing
- **Unit Tests**: Vitest for frontend, Jest for backend
- **Integration Tests**: API endpoint testing
- **E2E Tests**: (Future) Playwright or Cypress

### Deployment
1. **Database**: Supabase (already hosted)
2. **Backend**: Deploy to Railway/Render/Fly.io
3. **Frontend**: Deploy to Vercel/Netlify
4. **Environment**: Set environment variables in hosting platform

---

## Future Enhancements

- **Authentication**: User accounts and multi-user support
- **Real-time Updates**: WebSocket for live weather updates
- **Notifications**: Weather alerts and notifications
- **Forecasts**: Multi-day weather forecasts
- **Export**: Export weather data to CSV/JSON
- **Mobile App**: React Native mobile app

