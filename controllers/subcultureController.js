const pool = require('../config/db');
const { addLedgerEntry } = require('./batchController');

const getSubculturing = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subculturing ORDER BY transfer_date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSubculturing = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { transferDate, stageNumber, batchName, mediaCode, cropName, noOfBottles, noOfShoots, operatorName, mortality, remark, currentStage } = req.body;
    
    // Check if batch exists, if not create it
    let batchResult = await client.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    let batchId;
    
    if (batchResult.rows.length === 0) {
      // Create new batch
      const newBatch = await client.query(
        `INSERT INTO batches (batch_code, crop_name, initial_number_of_plants, current_number_of_plants, status, current_stage, created_date) 
         VALUES ($1, $2, $3, $4, 'active', 'subculturing', $5) RETURNING id`,
        [batchName, cropName, noOfShoots || 0, noOfShoots || 0, transferDate]
      );
      batchId = newBatch.rows[0].id;
    } else {
      // Update existing batch quantity
      batchId = batchResult.rows[0].id;
      // Ledger will handle batch updates
    }
    
    const result = await client.query(
      `INSERT INTO subculturing (batch_id, transfer_date, stage_number, media_code, no_of_bottles, no_of_shoots, operator_name, mortality, remark, batch_code, crop_name, current_stage, next_stage) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [batchId, transferDate, stageNumber, mediaCode, noOfBottles, noOfShoots, operatorName, mortality, remark, batchName, cropName, currentStage || null, stageNumber]
    );
    
    // Add to ledger and update batches table
    await addLedgerEntry(client, batchName, 'subculturing', noOfShoots, 'CREATE', 'subculturing', result.rows[0].id);
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};

const updateSubculturing = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { transferDate, stageNumber, batchName, mediaCode, cropName, noOfBottles, noOfShoots, operatorName, mortality, remark } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      return res.status(400).json({ message: 'Batch not found' });
    }
    const batchId = batchResult.rows[0].id;
    
    const result = await client.query(
      `UPDATE subculturing 
       SET batch_id=$1, transfer_date=$2, stage_number=$3, media_code=$4, no_of_bottles=$5, no_of_shoots=$6, operator_name=$7, mortality=$8, remark=$9, batch_code=$10, crop_name=$11, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$12 RETURNING *`,
      [batchId, transferDate, stageNumber, mediaCode, noOfBottles, noOfShoots, operatorName, mortality, remark, batchName, cropName, id]
    );
    
    // Add to ledger and update batches table
    await addLedgerEntry(client, batchName, 'subculturing', noOfShoots, 'UPDATE', 'subculturing', id);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Record not found' });
    }
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};

const deleteSubculturing = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Get data before delete
    const record = await client.query('SELECT batch_code, no_of_shoots FROM subculturing WHERE id = $1', [id]);
    if (record.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    const { batch_code, no_of_shoots } = record.rows[0];
    
    // Delete the record
    await client.query('DELETE FROM subculturing WHERE id=$1', [id]);
    
    // Add DELETE entry to ledger and update batches
    await addLedgerEntry(client, batch_code, 'subculturing', no_of_shoots, 'DELETE', 'subculturing', id);
    
    await client.query('COMMIT');
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { getSubculturing, createSubculturing, updateSubculturing, deleteSubculturing };
