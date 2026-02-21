const pool = require('../config/db');
const { addLedgerEntry } = require('./batchController');

const getIncubation = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incubation ORDER BY subculture_date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createIncubation = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { subcultureDate, stage, batchName, mediaCode, operatorName, cropName, noOfBottles, noOfShoots, temp, humidity, photoPeriod, lightIntensity } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await client.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      throw new Error('Batch not found');
    }
    const batchId = batchResult.rows[0].id;
    
    const result = await client.query(
      `INSERT INTO incubation (batch_id, subculture_date, stage, batch_code, media_code, operator_name, crop_name, no_of_bottles, no_of_shoots, temp, humidity, photo_period, light_intensity) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [batchId, subcultureDate, stage, batchName, mediaCode, operatorName, cropName, noOfBottles, noOfShoots, temp, humidity, photoPeriod, lightIntensity]
    );
    
    // Add to ledger and update batches table
    await addLedgerEntry(client, batchName, 'incubation', noOfShoots, 'CREATE', 'incubation', result.rows[0].id);
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};

const updateIncubation = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcultureDate, stage, batchName, mediaCode, operatorName, cropName, noOfBottles, noOfShoots, temp, humidity, photoPeriod, lightIntensity } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      return res.status(400).json({ message: 'Batch not found' });
    }
    const batchId = batchResult.rows[0].id;
    
    const result = await pool.query(
      `UPDATE incubation 
       SET batch_id=$1, subculture_date=$2, stage=$3, batch_code=$4, media_code=$5, operator_name=$6, crop_name=$7, no_of_bottles=$8, no_of_shoots=$9, temp=$10, humidity=$11, photo_period=$12, light_intensity=$13, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$14 RETURNING *`,
      [batchId, subcultureDate, stage, batchName, mediaCode, operatorName, cropName, noOfBottles, noOfShoots, temp, humidity, photoPeriod, lightIntensity, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteIncubation = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Get data before delete
    const record = await client.query('SELECT batch_code, no_of_shoots FROM incubation WHERE id = $1', [id]);
    if (record.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    const { batch_code, no_of_shoots } = record.rows[0];
    
    // Delete the record
    await client.query('DELETE FROM incubation WHERE id=$1', [id]);
    
    // Add DELETE entry to ledger and update batches
    await addLedgerEntry(client, batch_code, 'incubation', no_of_shoots, 'DELETE', 'incubation', id);
    
    await client.query('COMMIT');
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { getIncubation, createIncubation, updateIncubation, deleteIncubation };
