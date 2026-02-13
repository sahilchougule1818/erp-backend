# ERP Backend

Backend API for ERP system with PostgreSQL database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create PostgreSQL database and run schema:
```bash
psql -U postgres -d postgres -f schema.sql
```

3. Update `.env` file with your database credentials

4. Start server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login

### Indoor Module

#### Autoclave Cycles
- GET `/api/indoor/autoclave-cycles` - Get all autoclave cycles
- POST `/api/indoor/autoclave-cycles` - Create new autoclave cycle
- PUT `/api/indoor/autoclave-cycles/:id` - Update autoclave cycle
- DELETE `/api/indoor/autoclave-cycles/:id` - Delete autoclave cycle

#### Media Batches
- GET `/api/indoor/media-batches` - Get all media batches
- POST `/api/indoor/media-batches` - Create new media batch
- PUT `/api/indoor/media-batches/:id` - Update media batch
- DELETE `/api/indoor/media-batches/:id` - Delete media batch

#### Sampling
- GET `/api/indoor/sampling` - Get all sampling records
- POST `/api/indoor/sampling` - Create new sampling record
- PUT `/api/indoor/sampling/:id` - Update sampling record
- DELETE `/api/indoor/sampling/:id` - Delete sampling record

#### Subculturing
- GET `/api/indoor/subculturing` - Get all subculturing records
- POST `/api/indoor/subculturing` - Create new subculturing record
- PUT `/api/indoor/subculturing/:id` - Update subculturing record
- DELETE `/api/indoor/subculturing/:id` - Delete subculturing record

#### Incubation
- GET `/api/indoor/incubation` - Get all incubation records
- POST `/api/indoor/incubation` - Create new incubation record
- PUT `/api/indoor/incubation/:id` - Update incubation record
- DELETE `/api/indoor/incubation/:id` - Delete incubation record

#### Quality Control
- GET `/api/indoor/quality-control` - Get all quality control records
- POST `/api/indoor/quality-control` - Create new quality control record
- PUT `/api/indoor/quality-control/:id` - Update quality control record
- DELETE `/api/indoor/quality-control/:id` - Delete quality control record

#### Dashboard
- GET `/api/indoor/dashboard/stats?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD` - Get dashboard statistics

## Test Login
- Email: admin@seemabiotech.com
- Password: password123

## Authentication
All indoor module endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```