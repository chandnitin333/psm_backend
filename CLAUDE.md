# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PSM Backend is a TypeScript-based Node.js REST API application for a Property/Service Management system (PSM - likely Property/Service Management or related to Gram Panchayat tax management). It uses Express.js framework with MySQL database and is designed to run on port 4444.

## Development Commands

### Setup and Installation
```bash
npm i                          # Install dependencies
npm run build                  # Compile TypeScript and copy config files
```

### Running the Application
```bash
npm run dev                    # Development mode with auto-reload (uses nodemon)
NODE_ENV=dev npm start         # Production mode (requires build first)
NODE_ENV=dev npm start &       # Run in background
```

### PM2 Deployment
```bash
sudo npm install pm2 -g        # Install PM2 globally
npm run build                  # Build the project
NODE_ENV=dev npm run pm2       # Start with PM2
```

### Docker Commands
```bash
docker-compose down            # Stop containers
docker-compose build           # Build images
docker-compose up              # Start containers
docker-compose up --build      # Rebuild and start
docker-compose logs node       # View node logs
docker-compose logs mysql      # View MySQL logs
docker-compose down -v         # Stop and remove volumes
```

### TypeScript Compilation
```bash
npm run tsc                    # Compile TypeScript to JavaScript
```

## Architecture

### Project Structure
```
src/
├── app.ts                     # Application entry point
├── server.ts                  # Server class with Express configuration
├── config/
│   ├── db/
│   │   ├── db.ts             # MySQL connection pool and executeQuery function
│   │   └── db_bkk.ts         # Backup/alternative DB config
│   ├── Multer.ts             # File upload configuration
│   └── eganeetConfig.json    # Configuration file (copied to dist on build)
├── controllers/
│   ├── admin/                # Admin panel controllers
│   └── main/                 # Main app controllers (customer-facing)
├── services/
│   ├── admin/                # Admin business logic and DB queries
│   └── main/                 # Main app business logic
├── middleware/
│   └── GlobalMiddleware.ts   # Authentication, validation, file upload
├── routes/
│   ├── admin.routes.ts       # Admin API routes (/api/admin/*)
│   └── psm.routes.ts         # Main API routes (/api/*)
├── models/                   # Data models and types
├── environments/             # Environment configurations
│   ├── env.ts               # Environment selector
│   ├── dev.env.ts           # Development config
│   └── prod.env.ts          # Production config
├── constants/
│   └── constant.ts          # Application constants and enums
├── utils/
│   ├── ApiResponse.ts       # Standard response helpers (_200, _201, _400, etc.)
│   └── util.ts              # Utility functions
├── logger/
│   └── Logger.ts            # Winston logger configuration
└── types/
    └── express/             # TypeScript type definitions
```

### Three-Layer Architecture

This application follows a **Controller → Service → Database** pattern:

1. **Controllers** (`src/controllers/`): Handle HTTP requests/responses, input validation, and call services
   - Extract request parameters
   - Call service layer functions
   - Format responses using ApiResponse utilities (_200, _201, _400, _404, _409, etc.)
   - All responses return HTTP 200 with status code in JSON body

2. **Services** (`src/services/`): Contain business logic and database operations
   - Build SQL queries
   - Execute queries using `executeQuery()` from db.ts
   - Process and return data
   - Handle error cases and return null on failure

3. **Database** (`src/config/db/db.ts`): MySQL connection pool
   - `init()`: Creates connection pool at application startup
   - `executeQuery<T>(query, params)`: Generic query executor with parameterized queries

### Route Organization

The application has **two main route groups**:

1. **Admin Routes** (`/api/admin/*`): Administrative functions (requires authentication)
   - District, Taluka, Gram Panchayat, Gat Gram Panchayat management
   - Tax configuration (annual tax, other tax)
   - Property types (Milkat, Malmatta, Floor, Prakar, Tower)
   - User management, BDO users, committee members
   - Dashboard data uploads

2. **Main Routes** (`/api/*`): Customer-facing application features
   - Authentication (`/api/sign-in`)
   - Customer management (Malmatta Nodni)
   - Ferfar Yadi (change list/registry)
   - Nodni forms (tax assessment for construction, open plots, towers)
   - Namuna-8, Namuna-9 (standard forms)
   - Tax generation and Vasuli (collection)
   - Ward-wise reports and Adhar lists

### Authentication & Middleware

All routes are protected by middleware in `GlobalMiddleware.ts`:

- **`checkError`**: Validates request using express-validator
- **`authenticate`**: JWT-based authentication (Bearer token)
  - Extracts token from `Authorization` header
  - Verifies using secret from environment config
  - Attaches decoded user to `req.user`
- **`uploadFiles`**: Multer-based file upload handler

### Database Pattern

All database operations use **parameterized queries** to prevent SQL injection:

```typescript
const sql = `SELECT * FROM table WHERE id = ? AND status = ?`;
const params = [id, status];
return executeQuery(sql, params);
```

The `executeQuery` function:
- Returns a Promise
- Uses MySQL connection pool
- Handles BIT field type casting (converts to string)
- Throws errors for missing pool or query failures

### Environment Configuration

Environment is selected based on `NODE_ENV`:
- `NODE_ENV=production` → `ProdEnvironment`
- Otherwise → `DevEnvironment`

Environment must provide:
- `DB_HOST`, `DB_USER`, `DB_PWD`, `DB_NAME`
- `DB_CONNECTION_LIMIT`
- `jwt_secret`

### Response Standardization

All API responses use utilities from `ApiResponse.ts`:
- `_200(res, message, data)`: Success with data
- `_201(res, message, data)`: Created
- `_400(res, message)`: Bad request
- `_404(res, message)`: Not found
- `_409(res, message)`: Conflict (e.g., duplicate entry)

**Important**: All responses return HTTP 200, with actual status in JSON body's `status` field.

### Logging

Uses Winston logger (`src/logger/Logger.ts`):
- Log important operations and errors
- Logs stored in `logs/` directory
- Logger imported as: `import { logger } from './logger/Logger';`

### File Uploads

- Files stored in `uploads/` directory at project root
- Multer configuration in `src/config/Multer.ts`
- Upload path constant: `UPLOAD_PATH = '/uploads'` (in constants.ts)
- Express-fileupload is configured for multipart/form-data

## Domain-Specific Context

This application manages **Gram Panchayat (village council) property tax and administrative data** for Maharashtra, India:

- **Districts** → **Talukas** → **Gram Panchayats** → **Gat Gram Panchayats** (hierarchical administrative divisions)
- **Property Types**: Milkat (property), Malmatta (property type/category), Open Plots, Constructed Buildings, Towers
- **Tax Types**: Annual tax, Other tax, Construction tax, Open plot tax, Tower tax
- **Forms**: Namuna-8, Namuna-9 (standardized government forms)
- **Nodni**: Tax assessment/registration forms
- **Ferfar Yadi**: Change registry/amendment list
- **Vasuli**: Tax collection records
- **Ward-based organization**: Properties organized by ward numbers

## Requirements

- **Node.js**: 16.17
- **MySQL**: 3306 (configured via environment)
- **Port**: 4444

## Important Notes

- The build process copies `src/config/eganeetConfig.json` to `dist/config/`
- TypeScript target is ES6, compiled to CommonJS modules
- SQL queries often use stored procedures (see `procedure for PSM DB.sql`)
- Application uses soft deletes (DELETED_AT column pattern)
- Authentication tokens expire based on JWT configuration
- Database uses RTRIM on string comparisons for duplicate checking
