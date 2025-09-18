# GTD System - Getting Things Done Productivity Application

## Overview

This is a modern Getting Things Done (GTD) productivity application built with React, TypeScript, and Express. The system helps users organize tasks, projects, goals, and areas of focus according to David Allen's GTD methodology. It features a clean, reference-based design inspired by productivity tools like Notion and Linear, with an integrated AI chat assistant for natural language task management.

The application implements the core GTD categories: High Focus tasks, Quick Work items, Quick Personal tasks, Home tasks, Waiting For items, and Someday/Maybe lists. It also includes project management, goal tracking across different timeframes (vision, 3-5 year, 1-2 year), and area management for life domains.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom design system supporting light/dark modes
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for the REST API server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints for CRUD operations on tasks, projects, goals, and areas
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage
- **Development**: TSX for TypeScript execution in development mode

### Data Storage
- **Database**: PostgreSQL as the primary data store
- **Schema Design**: Four main entities (tasks, projects, goals, areas) with proper foreign key relationships
- **Database Provider**: Neon serverless PostgreSQL for cloud deployment
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Connection Pooling**: Neon serverless connection pooling for efficient database access

### Design System
- **Component Library**: Custom component system built on Radix UI primitives
- **Typography**: Inter font family via Google Fonts for modern, readable text
- **Color Scheme**: Dual-theme support with navy/purple accents in dark mode and clean blues in light mode
- **Layout System**: Consistent Tailwind spacing units (2, 4, 6, 8) for visual harmony
- **Interactive Elements**: Smooth animations for collapsible sections, hover states, and task completion

### Authentication & Authorization
- **Session-based Authentication**: Express sessions stored in PostgreSQL
- **User Management**: Basic user model with username-based identification
- **Storage Abstraction**: Interface-based storage layer supporting both memory and database implementations

### AI Integration
- **Chat Interface**: Fixed/sliding panel design with conversational UI
- **Natural Language Processing**: Simulated AI responses for task and project management
- **Purple Gradient Theming**: Distinct visual styling for AI chat separate from main application

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, Wouter for routing, TanStack React Query for data fetching
- **TypeScript**: Full TypeScript support with strict type checking enabled
- **Build Tools**: Vite with React plugin, ESBuild for server bundling, PostCSS for CSS processing

### UI and Styling
- **Radix UI**: Complete set of accessible UI primitives including dialogs, dropdowns, tooltips, and form controls
- **Tailwind CSS**: Utility-first CSS framework with custom configuration for the design system
- **Class Variance Authority**: For creating consistent component variants
- **Lucide React**: Modern icon library for consistent iconography

### Backend Infrastructure
- **Express.js**: Web application framework with middleware support
- **Drizzle ORM**: Modern TypeScript ORM with Zod integration for runtime validation
- **Neon Database**: Serverless PostgreSQL with WebSocket support for real-time connections
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Development and Tooling
- **TSX**: TypeScript execution engine for development
- **Drizzle Kit**: Database migration and introspection tool
- **Replit Integration**: Development environment plugins for error handling and debugging
- **Google Fonts**: External font loading for typography consistency

### Utility Libraries
- **Date-fns**: Date manipulation and formatting utilities
- **CLSX & Tailwind Merge**: Conditional CSS class composition
- **Nanoid**: URL-safe unique ID generation
- **Hook Form**: Form validation with Zod resolver integration