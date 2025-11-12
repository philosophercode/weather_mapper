# Weather Mapper - Planning Documents

This directory contains all planning and architecture documentation for the Weather Mapper application.

## Documents

### 📐 [Architecture Plan](./architecture-plan.md)
Comprehensive architecture documentation covering:
- System overview and high-level architecture
- Technology stack details
- API architecture and endpoints
- Frontend component structure
- Data flow diagrams
- Security architecture
- Deployment strategy
- Performance considerations

### 🗄️ [Database Schema](./database-schema.md)
Complete database design documentation including:
- Entity Relationship Diagram (ERD)
- Table schemas with detailed column definitions
- Indexes and constraints
- Common SQL queries
- Supabase setup SQL scripts
- Data flow visualization

### 🎨 [Wireframes](./wireframes/)
UI/UX wireframes for all pages:
- Map View (Home)
- Add City Page
- City Detail View
- City List View
- Settings Page

## Quick Reference

### Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + Node.js
- **Database**: Supabase (PostgreSQL)
- **Weather API**: OpenWeatherMap or WeatherAPI.com
- **Maps**: Leaflet

### Key Features
1. Add and manage tracked cities
2. Interactive map with weather markers
3. Current weather display
4. Historical weather charts
5. Favorite cities
6. Notes per city

### Database Tables
1. **weather_spots** - User-tracked cities
2. **weather_records** - Historical weather data

### API Endpoints
- `GET/POST /api/spots` - Manage weather spots
- `GET/PATCH/DELETE /api/spots/:id` - Spot operations
- `GET/POST /api/spots/:id/weather` - Weather data
- `GET /api/spots/:id/history` - Weather history
- `GET /api/weather/batch` - Batch weather update

## Next Steps

1. ✅ Architecture planning - Complete
2. ✅ Database design - Complete
3. ✅ Wireframes - Complete
4. ⏳ Backend setup - Next
5. ⏳ Frontend setup - Next
6. ⏳ Database migration - Next
7. ⏳ API implementation - Next
8. ⏳ Frontend implementation - Next
9. ⏳ Testing - Next
10. ⏳ Deployment - Next

