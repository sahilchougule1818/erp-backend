-- Migration: Remove tunnel_no and tray_bed_no from sampling table
-- and rename all vessels columns to bottles

-- ============================================
-- 1. SAMPLING TABLE - Remove columns
-- ============================================
ALTER TABLE sampling DROP COLUMN IF EXISTS tunnel_no;
ALTER TABLE sampling DROP COLUMN IF EXISTS tray_bed_no;

-- ============================================
-- 2. INCUBATION TABLE - Rename vessels to bottles
-- ============================================
ALTER TABLE incubation RENAME COLUMN no_of_vessels TO no_of_bottles;

-- ============================================
-- 3. SUBCULTURING TABLE - Rename vessels to bottles
-- ============================================
ALTER TABLE subculturing RENAME COLUMN no_of_vessels TO no_of_bottles;

-- ============================================
-- 4. MORTALITY_RECORD TABLE - Rename vessels to bottles (if exists)
-- ============================================
ALTER TABLE mortality_record RENAME COLUMN vessel_count TO bottle_count;

-- ============================================
-- VERIFICATION QUERIES (Run these to verify changes)
-- ============================================
-- Check sampling table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sampling' 
ORDER BY ordinal_position;

-- Check incubation table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'incubation' 
ORDER BY ordinal_position;

-- Check subculturing table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subculturing' 
ORDER BY ordinal_position;

-- Check mortality_record table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mortality_record' 
ORDER BY ordinal_position;
