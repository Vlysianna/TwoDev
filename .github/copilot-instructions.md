# TwoDev Assessment System - AI Coding Agent Instructions

## Project Architecture

This is a dual-repository assessment system with frontend (`TwoDev/`) and backend (`twodev_be/`) in separate workspaces:

- **Frontend**: React + TypeScript + Vite with shadcn/ui and Tailwind CSS
- **Backend**: Express + TypeScript + Prisma ORM (MySQL) with role-based authentication

## Key Architectural Patterns

### Backend Module Structure
The backend follows a domain-driven modular pattern in `src/modules/`:
```
modules/
├── auth/          # JWT authentication with bcrypt
├── user/          # User management
├── assessee/      # Assessment participants
├── assessor/      # Assessment evaluators  
├── assessment/    # APL1/APL2 assessment workflows
└── admin/         # Admin dashboard
```

Each module contains: `*.controller.ts`, `*.service.ts`, `*.routes.ts`, `*.type.ts`

### Database Design (Prisma)
Role-based system with three user types:
- **User** → base table with `role_id` foreign key
- **Assessee** → assessment participants (1:1 with User)
- **Assessor** → evaluators linked to schemes (1:1 with User)
- **Admin** → system administrators (1:1 with User)

Assessment workflow: `Assessment` → `Assessment_Details` → `Result`

### Frontend Architecture
- **Routes**: Centralized in `src/routes/AppRouter.tsx` using React Router
- **API Layer**: Axios instance in `src/helper/axios.ts` with `VITE_APi_URL` env var
- **UI Components**: shadcn/ui with Radix primitives in `src/components/ui/`
- **Styling**: Tailwind CSS v4 with CSS variables for theming

## Development Workflows

### Backend Development
```bash
# In twodev_be/
npm run dev              # Start with nodemon
npm run prisma:migrate   # Run database migrations
npm run seed             # Seed database
```

### Frontend Development  
```bash
# In TwoDev/
npm run dev     # Vite dev server
npm run build   # TypeScript compilation + Vite build
```

### API Documentation
Swagger UI auto-generated at `/api-docs` from `api-contract/openapi.yaml`

## Critical Patterns & Conventions

### Authentication Flow
- JWT tokens with 7-day expiration in `auth.service.ts`
- Middleware: `middleware/auth.middleware.ts` extends Request with user data
- Protected routes use `authenticateToken` middleware

### API Response Format
Consistent JSON structure across all endpoints:
```typescript
{
  success: boolean,
  message: string,
  data?: any
}
```

### Frontend Environment Variables
- `VITE_APi_URL`: Backend API base URL (note the typo in env var name)

### Database Conventions
- All tables use auto-increment `id` as primary key
- Foreign keys follow `{table}_id` pattern
- User relationships are 1:1 with role-specific tables

### Component Patterns
- UI components use `cn()` utility from `lib/utils.ts` for className merging
- shadcn/ui components configured with "new-york" style variant
- Tailwind CSS variables defined in `src/index.css` with light/dark theme support

## Assessment-Specific Logic

### APL Assessment Types
- **APL1**: Self-assessment and certificate data (`modules/assessement/apl1/`)
- **APL2**: Formal assessment process (`modules/assessement/apl2/`)

### Key Assessment Endpoints
- `POST /api/assessment/apl1/create-self-data`
- `POST /api/assessment/apl2/create-assessment`
- `GET /api/assessments` (various assessment retrieval endpoints)

## File Naming & Import Conventions

- Backend: CommonJS require() for external deps, ES6 imports for internal modules
- Frontend: Consistent `@/` path alias for src/ directory
- TypeScript: Strict mode enabled with separate configs for app and node

## Integration Points

- **Auth**: JWT passed via `Authorization: Bearer {token}` header
- **CORS**: Enabled for cross-origin requests between frontend/backend
- **Database**: MySQL via Prisma with migration-based schema management
- **File Uploads**: Assessment documents handling (referenced in TODO comments)
