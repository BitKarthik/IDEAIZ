# Overview

MyOrca is a Vedic astrology mobile application built with React Native and Expo. The app provides personalized astrological insights, daily horoscopes, and an AI-powered question-answering interface based on users' birth charts. Users can receive cosmic guidance through daily predictions, detailed birth chart analysis, planetary transit information, and interactive consultations with an AI astrologer.

The application targets iOS, Android, and web platforms using a single React Native codebase, with a Node.js/Express backend serving API endpoints and managing data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React Native with Expo SDK 54
- Uses the new React Native architecture (Fabric) with Expo's new architecture enabled
- React 19.1.0 with experimental React Compiler support
- TypeScript for type safety across the codebase

**Navigation**: React Navigation v7
- Bottom tab navigation with 3 main tabs (Today, Ask, Profile)
- Native stack navigator for modal presentations (Onboarding, Birth Chart, Subscription, Preset Questions)
- Deep linking support via custom scheme `myorca://`

**State Management**:
- React Context API (`AppContext`) for global application state including user data, birth details, messages, subscription status, and daily horoscope
- TanStack Query (React Query) v5 for server state management and API caching
- Local component state with React hooks for UI interactions

**UI/Styling**:
- Custom theming system with light/dark mode support
- Design tokens defined in `constants/theme.ts` for spacing, colors, typography, and border radius
- Animated components using Reanimated v4 for smooth interactions
- Blur effects and glass morphism on iOS via `expo-blur` and `expo-glass-effect`
- Safe area handling with `react-native-safe-area-context`

**Key UI Patterns**:
- Keyboard-aware scroll views for forms with fallback to standard ScrollView on web
- Animated pressable components with spring physics for tactile feedback
- Card-based elevation system with configurable background colors
- Error boundaries for graceful error handling

## Backend Architecture

**Runtime**: Node.js with Express.js
- TypeScript codebase compiled via `tsx` for development and `esbuild` for production
- Development uses hot-reload, production builds to `server_dist/` as ESM modules

**API Design**:
- RESTful endpoints under `/api` prefix
- CORS configuration supporting Replit development and deployment domains
- Credentials included for session management
- WebSocket support via `ws` library for real-time features

**Data Layer**:
- Drizzle ORM v0.39 for database interactions
- PostgreSQL as the primary database
- Schema definitions in `shared/schema.ts` with Zod validation via `drizzle-zod`
- Database migrations managed through `drizzle-kit` in `migrations/` directory
- In-memory storage fallback (`MemStorage`) for development/testing

**Code Organization**:
- Shared TypeScript types and schemas in `shared/` directory accessible to both client and server
- Path aliases: `@/` for client code, `@shared/` for shared code
- Module resolution configured in both Babel and TypeScript configs

## External Dependencies

**AI Integration**:
- OpenAI SDK v6.10 for AI-powered astrological consultations
- Integration likely used for generating personalized responses to user questions based on birth chart data

**Authentication** (Planned):
- Apple Sign-In for iOS (required by App Store)
- Google Sign-In for cross-platform authentication
- Email/password fallback authentication
- Session-based authentication with credentials stored in cookies

**Database**:
- PostgreSQL database provisioned via environment variable `DATABASE_URL`
- Connection pooling via `pg` library
- Schema includes users table with username/password fields

**Platform Services**:
- Expo platform services for builds, updates, and native module access
- Native modules: haptics, linking, splash screen, status bar, system UI, web browser
- Image optimization via `expo-image`
- Font loading via `expo-font`
- Platform-specific icons and splash screens

**Development Environment**:
- Replit-specific configuration for domain handling and proxying
- Environment variables for deployment URLs (`REPLIT_DEV_DOMAIN`, `REPLIT_INTERNAL_APP_DOMAIN`)
- HTTP proxy middleware for development server routing
- Static build generation for production deployment

**Design System**:
- Feather icons via `@expo/vector-icons`
- SF Symbols on iOS via `expo-symbols`
- Custom color palette with purple primary (#6B46C1), golden amber secondary (#F59E0B), and teal accent (#14B8A6)
- Responsive design supporting portrait orientation with edge-to-edge layout on Android

**Code Quality Tools**:
- ESLint with Expo configuration and Prettier integration
- TypeScript strict mode enabled
- Format checking and auto-fixing via Prettier

# Current Implementation Status

## Completed Features
- **Today Screen**: Daily horoscope, color-coded status circles (teal/amber/red), Embrace/Avoid sections, auspicious times
- **Ask Screen**: AI astrologer chat with OpenAI integration, preset questions
- **Profile Screen**: User profile display with edit functionality, subscription management
- **Edit Profile Modal**: Form for name, birth date, time, and place with validation
- **n8n Integration**: One-way REST API for workflow automation (POST /api/n8n)
- **Theme System**: Proper light/dark mode detection and CTA text contrast

## Backend API Routes
- User CRUD: `/api/users` (register), `/api/users/:id` (get/update/delete)
- n8n webhook: `/api/n8n` (POST to external workflow)
- Zod validation on all endpoints

## Known Limitations (Planned Enhancements)
- **Profile Persistence**: EditProfileModal currently updates in-memory state only; backend API exists but requires authentication before wiring
- **Authentication**: Backend has user CRUD routes but no hashed passwords or session auth yet
- **Data Synchronization**: AppContext uses hardcoded default user; needs hydration from backend once auth is implemented