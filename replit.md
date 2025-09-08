# Zenture - Mental Wellness Platform

## Overview

Zenture is a mental wellness platform designed specifically for college students. It provides a comprehensive solution for bridging the gap in mental health support on campus. The platform offers features like psychoeducational content, counselor session booking, peer support communities, and AI-powered chat assistance. Built as a modern full-stack web application, it emphasizes accessibility, safety, and user-friendly design to help students navigate their mental health journey.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI framework using TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **Shadcn/ui Component Library**: Pre-built, accessible UI components following design system principles
- **Tailwind CSS**: Utility-first CSS framework for rapid styling and consistent design
- **Wouter Router**: Lightweight client-side routing solution
- **TanStack React Query**: Server state management for API calls and caching

### Backend Architecture
- **Express.js Server**: RESTful API server handling HTTP requests and middleware
- **TypeScript**: Type-safe server-side development
- **Storage Interface Pattern**: Abstracted storage layer supporting both in-memory and database implementations
- **Modular Route System**: Organized API endpoints with separation of concerns

### Data Storage Solutions
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations
- **PostgreSQL Database**: Primary database for user data and application state
- **Neon Database**: Cloud-hosted PostgreSQL service for scalable database management
- **Schema-First Design**: Zod validation schemas ensuring data consistency between client and server

### Authentication and Authorization
- **User Management System**: Basic user schema with username/password authentication
- **Session-Based Authentication**: Server-side session management for user state
- **Input Validation**: Zod schemas for request validation and type safety

### External Dependencies
- **Neon Database**: Cloud PostgreSQL hosting service
- **Google Fonts**: Typography resources (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Unsplash**: Stock photography for platform imagery
- **Radix UI Primitives**: Accessible, unstyled UI component primitives
- **Lucide Icons**: Consistent icon library for user interface elements