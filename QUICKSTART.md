# ERP Backend - Quick Start

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
# OR
sudo systemctl start postgresql  # Linux

# Create tables
psql -U postgres -d postgres -f schema.sql
```

### 3. Configure Environment
The `.env` file is already configured. 

**If your PostgreSQL has NO password (default on macOS):**
```env
DB_PASSWORD=
```
Leave it empty as is.

**If your PostgreSQL has a password:**
```env
DB_PASSWORD=your_postgres_password_here
```

### 4. Start Server
```bash
npm run dev
```

Server will run on: `http://localhost:3001`

## Default Login
- Email: `admin@seemabiotech.com`
- Password: `password123`

## API Documentation
See main README.md for complete API endpoints.
