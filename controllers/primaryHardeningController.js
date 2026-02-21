const pool = require('../config/db');
const { addLedgerEntry } = require('./batchController');

// Get all primary hardening records with tray details
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ph.*,
        COALESCE(
          STRING_AGG(td.tray_name || '-' || td.quantity, ', ' ORDER BY td.id),
          ''
        ) as tray_display,
        COALESCE(SUM(td.plants_per_tray), 0) as total_plants
      FROM primary_hardening ph
      LEFT JOIN tray_details td ON ph.id = td.primary_hardening_id
      GROUP BY ph.id
      ORDER BY ph.date DESC, ph.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create primary hardening record with tray details
exports.create = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { date, cropName, batchName, tunnel, workers, waitingPeriod, notes, trays } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await client.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      throw new Error('Batch not found');
    }
    const batchId = batchResult.rows[0].id;
    
    // Insert primary hardening record
    const phResult = await client.query(
      `INSERT INTO primary_hardening (batch_id, date, batch_code, crop_name, tunnel, workers, waiting_period, notes, tray_count, plants)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [batchId, date, batchName, cropName, tunnel, workers, waitingPeriod, notes, trays?.length || 0, 0]
    );
    
    const primaryId = phResult.rows[0].id;
    let totalPlants = 0;
    
    // Insert tray details
    if (trays && trays.length > 0) {
      for (const tray of trays) {
        await client.query(
          `INSERT INTO tray_details (primary_hardening_id, tray_name, cavity_count, quantity)
           VALUES ($1, $2, $3, $4)`,
          [primaryId, tray.name, tray.cavityCount, tray.quantity]
        );
        totalPlants += tray.cavityCount * tray.quantity;
      }
      
      // Update plants count in primary hardening
      await client.query(
        `UPDATE primary_hardening SET plants = $1 WHERE id = $2`,
        [totalPlants, primaryId]
      );
      
      // Add to ledger and update batches table
      await addLedgerEntry(client, batchName, 'primary-hardening', totalPlants, 'CREATE', 'primary_hardening', primaryId);
    }
    
    await client.query('COMMIT');
    
    // Fetch complete record
    const finalResult = await pool.query(
      `SELECT ph.*, 
        STRING_AGG(td.tray_name || '-' || td.quantity, ', ' ORDER BY td.id) as tray_display
       FROM primary_hardening ph
       LEFT JOIN tray_details td ON ph.id = td.primary_hardening_id
       WHERE ph.id = $1
       GROUP BY ph.id`,
      [primaryId]
    );
    
    res.json(finalResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating:', error);
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Update primary hardening record
exports.update = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { date, cropName, batchName, tunnel, workers, waitingPeriod, notes, trays } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await client.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      throw new Error('Batch not found');
    }
    const batchId = batchResult.rows[0].id;
    
    // Update primary hardening
    await client.query(
      `UPDATE primary_hardening 
       SET batch_id=$1, date=$2, batch_code=$3, crop_name=$4, tunnel=$5, workers=$6, waiting_period=$7, notes=$8, tray_count=$9, updated_at=CURRENT_TIMESTAMP
       WHERE id=$10`,
      [batchId, date, batchName, cropName, tunnel, workers, waitingPeriod, notes, trays?.length || 0, id]
    );
    
    // Delete old tray details
    await client.query('DELETE FROM tray_details WHERE primary_hardening_id = $1', [id]);
    
    let totalPlants = 0;
    // Insert new tray details
    if (trays && trays.length > 0) {
      console.log('Inserting trays for primary_hardening_id:', id);
      console.log('Trays data:', trays);
      for (const tray of trays) {
        console.log('Inserting tray:', tray, 'for primary_hardening_id:', id);
        await client.query(
          `INSERT INTO tray_details (primary_hardening_id, tray_name, cavity_count, quantity)
           VALUES ($1, $2, $3, $4)`,
          [id, tray.name, tray.cavityCount, tray.quantity]
        );
        totalPlants += tray.cavityCount * tray.quantity;
      }
      
      // Update plants count in primary hardening
      await client.query(
        `UPDATE primary_hardening SET plants = $1 WHERE id = $2`,
        [totalPlants, id]
      );
      
      // Add to ledger and update batches table
      await addLedgerEntry(client, batchName, 'primary-hardening', totalPlants, 'UPDATE', 'primary_hardening', id);
    }
    
    await client.query('COMMIT');
    
    // Fetch complete record
    const finalResult = await pool.query(
      `SELECT ph.*, 
        STRING_AGG(td.tray_name || '-' || td.quantity, ', ' ORDER BY td.id) as tray_display
       FROM primary_hardening ph
       LEFT JOIN tray_details td ON ph.id = td.primary_hardening_id
       WHERE ph.id = $1
       GROUP BY ph.id`,
      [id]
    );
    
    res.json(finalResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Delete primary hardening record (cascade deletes tray_details)
exports.delete = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Get data before delete
    const record = await client.query('SELECT batch_code, plants FROM primary_hardening WHERE id = $1', [id]);
    const { batch_code, plants } = record.rows[0];
    
    // Delete the record
    await client.query('DELETE FROM primary_hardening WHERE id=$1', [id]);
    
    // Add DELETE entry to ledger and update batches
    await addLedgerEntry(client, batch_code, 'primary-hardening', plants, 'DELETE', 'primary_hardening', id);
    
    await client.query('COMMIT');
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Get tray details for a specific primary hardening record
exports.getTrayDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM tray_details WHERE primary_hardening_id = $1 ORDER BY id',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
