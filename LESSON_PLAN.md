# Weather Mapper - Lesson Plan

## What is Weather Mapper?
Weather Mapper is a full-stack TypeScript application that lets users track weather across multiple cities with an interactive map interface. Users can add cities to their watchlist, view current weather conditions, and analyze historical temperature trends with charts. Built with React, Express, Supabase, and the OpenWeatherMap API, it demonstrates modern web development practices and AI-assisted coding with Cursor.

## 1. Cursor Overview
- AI-powered code editor built on VSCode
- Natural language to code generation
- Context-aware assistance
- Multi-file editing capabilities
- Built-in terminal and debugging
- Composer for complex tasks

## 2. Setup Prerequisites
- **Install Docker Desktop**
  - Required for local Supabase instance
  - Verify: `docker --version` and `docker ps`
- **Install Node.js 18+**
  - LTS version recommended
  - Verify: `node --version` and `npm --version`
- **Get OpenWeather API Key**
  - Sign up at https://openweathermap.org/api
  - Free tier: 1,000 calls/day
  - Save key for later configuration

## 3. Pull Repository & Project Plan
- **Clone from Git**
  - `git clone <repository-url>`
  - Review project structure
- **Explore the `plan/` folder**
  - `architecture-plan.md` - System design
  - `database-schema.md` - Database structure
  - `wireframes/` - UI mockups
  - `README.md` - Overview and roadmap

## 4. Cursor Rules
- **Understanding `.cursor/rules/`**
  - Project-specific AI guidelines
  - Code standards and conventions
  - Architecture decisions
  - API design patterns
- **How rules influence Cursor**
  - Provides context for code generation
  - Ensures consistency
  - Enforces best practices

## 5. Create a Plan with Cursor
- **Using Cursor Composer**
  - Open Composer (Cmd/Ctrl + I)
  - Describe what you want to build
  - Let Cursor analyze requirements
- **Break down into tasks**
  - Database setup
  - Backend API endpoints
  - Frontend components
  - Integration points
- **Review generated plan**
  - Validate approach
  - Adjust as needed

## 6. Execute the Plan
- **Start with database**
  - Use Cursor to generate migrations
  - Review and run SQL scripts
- **Build backend services**
  - Routes, controllers, services
  - API validation and error handling
- **Create frontend components**
  - Pages, components, hooks
  - State management
- **Iterate and refine**
  - Test as you go
  - Fix issues with Cursor's help

## 7. Let It Run
- **Start local Supabase**
  - `cd supabase && npx supabase start`
  - Copy connection details
- **Configure environment variables**
  - Backend `.env` (Supabase + Weather API)
  - Frontend `.env` (API URL)
- **Start development servers**
  - Backend: `cd backend && npm run dev`
  - Frontend: `cd frontend && npm run dev`
- **Test the application**
  - Add cities, view weather, explore map

## 8. Build Components

### Database
- Review migration files
- Understand schema design
- Tables: `weather_spots`, `weather_records`
- Indexes and relationships

### Backend
- Express.js + TypeScript
- REST API architecture
- Service layer pattern
- External API integration (OpenWeather)
- Error handling and validation

### Frontend
- React + TypeScript + Vite
- Component structure
- React Router for navigation
- TanStack Query for data fetching
- Leaflet for interactive maps
- Recharts for weather history

## 9. Deployment
- **Database: Supabase Cloud**
  - Already hosted and managed
  - Run migrations in production
- **Backend Options**
  - Railway (recommended)
  - Render
  - Fly.io
- **Frontend Options**
  - Vercel (recommended)
  - Netlify
- **Environment Configuration**
  - Set production environment variables
  - Configure CORS
  - Update API URLs
- **Testing & Monitoring**
  - Verify health checks
  - Test all features
  - Monitor API usage

## Key Takeaways
- Cursor accelerates development with AI assistance
- Good planning and architecture are still essential
- Cursor rules provide project-specific context
- Iterative development with constant testing
- Modern full-stack TypeScript architecture
- Deploy early and often

