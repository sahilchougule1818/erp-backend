-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Autoclave Cycles table
CREATE TABLE IF NOT EXISTS autoclave_cycles (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    media_code VARCHAR(50) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    type_of_media VARCHAR(100) NOT NULL,
    autoclave_on TIME NOT NULL,
    media_loading TIME NOT NULL,
    pressure TIME NOT NULL,
    off TIME NOT NULL,
    open TIME NOT NULL,
    media_total VARCHAR(20) NOT NULL,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media Batches table
CREATE TABLE IF NOT EXISTS media_batches (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    media_code VARCHAR(50) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    quantity VARCHAR(20) NOT NULL,
    bottles INTEGER NOT NULL,
    contamination TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sampling table
CREATE TABLE IF NOT EXISTS sampling (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    media_code VARCHAR(50) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    type_of_media VARCHAR(100) NOT NULL,
    bottles_used INTEGER NOT NULL,
    explants_inoculated INTEGER NOT NULL,
    contamination TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subculturing table
CREATE TABLE IF NOT EXISTS subculturing (
    id SERIAL PRIMARY KEY,
    transfer_date DATE NOT NULL,
    media_code VARCHAR(50) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    type_of_media VARCHAR(100) NOT NULL,
    vessels_used INTEGER NOT NULL,
    shoots_transferred INTEGER NOT NULL,
    contamination TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incubation table
CREATE TABLE IF NOT EXISTS incubation (
    id SERIAL PRIMARY KEY,
    subculture_date DATE NOT NULL,
    media_code VARCHAR(50) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    type_of_media VARCHAR(100) NOT NULL,
    vessels_count INTEGER NOT NULL,
    shoots_count INTEGER NOT NULL,
    growth_status VARCHAR(50),
    contamination TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quality Control table
CREATE TABLE IF NOT EXISTS quality_control (
    id SERIAL PRIMARY KEY,
    inspection_date DATE NOT NULL,
    media_code VARCHAR(50) NOT NULL,
    batch_number VARCHAR(50) NOT NULL,
    inspector VARCHAR(255) NOT NULL,
    quality_status VARCHAR(50) NOT NULL,
    contamination_rate DECIMAL(5,2),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (email, password, name, role) 
VALUES ('admin@seemabiotech.com', 'password123', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
