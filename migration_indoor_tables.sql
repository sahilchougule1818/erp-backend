-- Update autoclave_cycles table
DROP TABLE IF EXISTS autoclave_cycles CASCADE;
CREATE TABLE autoclave_cycles (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  media_code VARCHAR(50),
  operator_name VARCHAR(100),
  type_of_media VARCHAR(100),
  autoclave_on_time TIME,
  media_loading_time TIME,
  pressure_time TIME,
  off_time TIME,
  open_time TIME,
  media_total VARCHAR(50),
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update media_batches table
DROP TABLE IF EXISTS media_batches CASCADE;
CREATE TABLE media_batches (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  media_code VARCHAR(50),
  operator_name VARCHAR(100),
  quantity VARCHAR(50),
  bottles INTEGER,
  contamination TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update subculturing table
DROP TABLE IF EXISTS subculturing CASCADE;
CREATE TABLE subculturing (
  id SERIAL PRIMARY KEY,
  transfer_date DATE NOT NULL,
  stage_number VARCHAR(50),
  batch_name VARCHAR(100),
  media_code VARCHAR(50),
  crop_name VARCHAR(100),
  no_of_vessels INTEGER,
  no_of_shoots INTEGER,
  operator_name VARCHAR(100),
  mortality VARCHAR(50),
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update incubation table
DROP TABLE IF EXISTS incubation CASCADE;
CREATE TABLE incubation (
  id SERIAL PRIMARY KEY,
  subculture_date DATE NOT NULL,
  stage VARCHAR(50),
  batch_name VARCHAR(100),
  media_code VARCHAR(50),
  operator_name VARCHAR(100),
  crop_name VARCHAR(100),
  no_of_vessels INTEGER,
  no_of_shoots INTEGER,
  temp VARCHAR(50),
  humidity VARCHAR(50),
  photo_period VARCHAR(50),
  light_intensity VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cleaning_record table (replacing quality_control)
DROP TABLE IF EXISTS cleaning_record CASCADE;
CREATE TABLE cleaning_record (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  operator_name VARCHAR(100),
  area_cleaned TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create deep_cleaning_record table
DROP TABLE IF EXISTS deep_cleaning_record CASCADE;
CREATE TABLE deep_cleaning_record (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  operator VARCHAR(100),
  instrument_cleaned TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mortality_record table
DROP TABLE IF EXISTS mortality_record CASCADE;
CREATE TABLE mortality_record (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  batch_name VARCHAR(100),
  vessel_count INTEGER,
  type_of_mortality VARCHAR(100),
  possible_source TEXT,
  disposal_method TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sampling table already updated in previous migration
