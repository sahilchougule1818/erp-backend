const pool = require('../config/db');
const { addLedgerEntry } = require('./batchController');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM secondary_hardening ORDER BY transfer_date DESC, created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { transferDate, cropName, batchName, fromLocation, toBed, plants, notes } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await client.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      throw new Error('Batch not found');
    }
    const batchId = batchResult.rows[0].id;
    
    const result = await client.query(
      `INSERT INTO secondary_hardening (batch_id, transfer_date, batch_code, crop_name, from_location, to_bed, plants, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [batchId, transferDate, batchName, cropName, fromLocation, toBed, plants, notes]
    );
    
    // Add to ledger and update batches table
    await addLedgerEntry(client, batchName, 'secondary-hardening', plants, 'CREATE', 'secondary_hardening', result.rows[0].id);
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

exports.update = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { transferDate, cropName, batchName, fromLocation, toBed, plants, notes } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await client.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      throw new Error('Batch not found');
    }
    const batchId = batchResult.rows[0].id;
    
    const result = await client.query(
      `UPDATE secondary_hardening 
       SET batch_id=$1, transfer_date=$2, batch_code=$3, crop_name=$4, from_location=$5, to_bed=$6, plants=$7, notes=$8, updated_at=CURRENT_TIMESTAMP
       WHERE id=$9 RETURNING *`,
      [batchId, transferDate, batchName, cropName, fromLocation, toBed, plants, notes, id]
    );
    
    // Add to ledger and update batches table
    await addLedgerEntry(client, batchName, 'secondary-hardening', plants, 'UPDATE', 'secondary_hardening', id);
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

exports.delete = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Get data before delete
    const record = await client.query('SELECT batch_code, plants FROM secondary_hardening WHERE id = $1', [id]);
    if (record.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    const { batch_code, plants } = record.rows[0];
    
    // Delete the record
    await client.query('DELETE FROM secondary_hardening WHERE id=$1', [id]);
    
    // Add DELETE entry to ledger and update batches
    await addLedgerEntry(client, batch_code, 'secondary-hardening', plants, 'DELETE', 'secondary_hardening', id);
    
    await client.query('COMMIT');
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};
