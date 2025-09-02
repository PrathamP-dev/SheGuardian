# SheGuardian - Women's Safety Platform

## Overview

SheGuardian is a comprehensive women's safety web application built to provide real-time emergency response, community support, and trusted networks. The platform features an emergency SOS system, nearby volunteer response, location tracking, trusted contact notifications, and incident reporting capabilities. Built as a full-stack TypeScript application with modern React frontend and Express.js backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: OpenID Connect (OIDC) with Replit Auth integration
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with proper error handling middleware

### Data Layer
- **Database**: PostgreSQL with connection pooling via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Validation**: Drizzle-Zod for runtime validation of database schemas

### Core Data Models
- **Users**: Profile information, volunteer status, preferences
- **Trusted Contacts**: Emergency contact relationships with priorities
- **Emergency Alerts**: SOS triggers with location and response tracking
- **Volunteer Responses**: Community member responses to emergency alerts
- **Incident Reports**: User-submitted safety reports with location data
- **Activity Logs**: Comprehensive audit trail of user actions

### Security & Authentication
- **Authentication Provider**: Replit OIDC with session-based auth
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Role-based access with authenticated route protection
- **Data Privacy**: User consent for location sharing and emergency contacts

### Location & Emergency Services
- **Geolocation**: Browser-based GPS with fallback options
- **Emergency Response**: Integration points for emergency services (911, local authorities)
- **Volunteer Network**: Proximity-based volunteer matching within configurable radius
- **Real-time Notifications**: Alert system for trusted contacts and nearby volunteers

### Mobile-First Design
- **Responsive UI**: Mobile-optimized interface with touch-friendly interactions
- **Progressive Web App**: Offline capabilities and native app-like experience
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OIDC service for user authentication
- **Development**: Replit development environment with hot reload

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Framework**: Radix UI primitives, Shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **State Management**: TanStack React Query for server state
- **Validation**: Zod for schema validation and type safety

### Backend Libraries
- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM, PostgreSQL connection pooling
- **Authentication**: OpenID Connect client, Passport.js strategies
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: TSX for TypeScript execution, Vite for frontend bundling

### Development Tools
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint, Prettier (implied by project structure)
- **Database Migrations**: Drizzle Kit for schema management