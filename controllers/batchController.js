const pool = require('../config/db');

// Get all batches from batches table with their latest subculture stage
exports.getIndoorBatches = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id, 
        b.batch_code, 
        b.crop_name, 
        b.status, 
        b.current_stage,
        COALESCE(s.next_stage, 'New Batch') as subculture_stage,
        b.created_date
      FROM batches b
      LEFT JOIN LATERAL (
        SELECT next_stage 
        FROM subculturing 
        WHERE batch_code = b.batch_code 
        ORDER BY transfer_date DESC, id DESC 
        LIMIT 1
      ) s ON true
      WHERE b.status = 'active'
      ORDER BY b.created_date DESC, b.batch_code DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get batches that have been marked as available for outdoor
exports.getOutdoorReadyBatches = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        b.batch_code, 
        b.crop_name, 
        b.current_number_of_plants
      FROM batches b
      JOIN subculturing s ON b.batch_code = s.batch_code
      WHERE s.available_for_outdoor IS NOT NULL
      AND b.status = 'active'
      ORDER BY b.batch_code
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark batch as available for outdoor
exports.transferToOutdoor = async (req, res) => {
  try {
    const { batchCode } = req.params;
    
    // Update only the latest subculturing record for this batch
    await pool.query(`
      UPDATE subculturing 
      SET available_for_outdoor = 1 
      WHERE batch_code = $1 
      AND id = (
        SELECT MAX(id) 
        FROM subculturing 
        WHERE batch_code = $1
      )
    `, [batchCode]);
    
    res.json({ message: 'Batch marked as available for outdoor' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Undo outdoor availability
exports.undoOutdoorTransfer = async (req, res) => {
  try {
    const { batchCode } = req.params;
    
    // Update only the latest subculturing record for this batch
    await pool.query(`
      UPDATE subculturing 
      SET available_for_outdoor = NULL 
      WHERE batch_code = $1 
      AND id = (
        SELECT MAX(id) 
        FROM subculturing 
        WHERE batch_code = $1
      )
    `, [batchCode]);
    
    res.json({ message: 'Outdoor availability removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Recalculate current data for all batches
exports.recalculateCurrentData = async (req, res) => {
  try {
    await pool.query('SELECT update_batch_current_data()');
    res.json({ message: 'Batch current data recalculated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Helper function to add ledger entry and update batches
const addLedgerEntry = async (client, batchCode, stage, numberOfPlants, operation, sourceTable, sourceId) => {
  console.log('Adding ledger entry:', { batchCode, stage, numberOfPlants, operation, sourceTable, sourceId });
  
  if (operation === 'DELETE') {
    // Mark ledger entry as deleted
    await client.query(
      'UPDATE batch_ledger SET is_deleted = 1 WHERE source_table = $1 AND source_id = $2',
      [sourceTable, sourceId]
    );
  } else {
    // Add CREATE/UPDATE entry to ledger
    await client.query(
      'INSERT INTO batch_ledger (batch_code, stage, number_of_plants, operation, source_table, source_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [batchCode, stage, numberOfPlants, operation, sourceTable, sourceId]
    );
  }
  
  // Get latest non-deleted entry from ledger
  const latestResult = await client.query(`
    SELECT stage, number_of_plants FROM batch_ledger 
    WHERE batch_code = $1 AND is_deleted = 0
    ORDER BY created_at DESC LIMIT 1
  `, [batchCode]);
  
  console.log('Latest non-deleted entry:', latestResult.rows);
  
  if (latestResult.rows.length > 0) {
    const { stage, number_of_plants } = latestResult.rows[0];
    await client.query(
      'UPDATE batches SET current_number_of_plants = $1, current_stage = $2, updated_at = CURRENT_TIMESTAMP WHERE batch_code = $3',
      [number_of_plants, stage, batchCode]
    );
  } else {
    // No active entries, reset to initial
    await client.query(
      'UPDATE batches SET current_number_of_plants = initial_number_of_plants, current_stage = $1, updated_at = CURRENT_TIMESTAMP WHERE batch_code = $2',
      ['subculturing', batchCode]
    );
  }
};

module.exports = { 
  getIndoorBatches: exports.getIndoorBatches,
  getOutdoorReadyBatches: exports.getOutdoorReadyBatches,
  transferToOutdoor: exports.transferToOutdoor,
  undoOutdoorTransfer: exports.undoOutdoorTransfer,
  recalculateCurrentData: exports.recalculateCurrentData,
  addLedgerEntry 
};