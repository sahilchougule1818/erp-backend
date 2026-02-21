const pool = require('../config/db');

const getSampling = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sampling ORDER BY sample_date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSampling = async (req, res) => {
  try {
    const { sampleDate, cropName, batchName, stage, sentDate, receivedDate, status, govtCertificate, certificateNo, reason } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      return res.status(400).json({ message: 'Batch not found' });
    }
    const batchId = batchResult.rows[0].id;
    
    const result = await pool.query(
      `INSERT INTO sampling (batch_id, sample_date, crop_name, batch_code, stage, sent_date, received_date, status, govt_certificate, certificate_no, reason) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [batchId, sampleDate, cropName, batchName, stage, sentDate, receivedDate, status, govtCertificate, certificateNo, reason]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSampling = async (req, res) => {
  try {
    const { id } = req.params;
    const { sampleDate, cropName, batchName, stage, sentDate, receivedDate, status, govtCertificate, certificateNo, reason } = req.body;
    
    // Get batch_id from batch_code
    const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
    if (batchResult.rows.length === 0) {
      return res.status(400).json({ message: 'Batch not found' });
    }
    const batchId = batchResult.rows[0].id;
    
    const result = await pool.query(
      `UPDATE sampling 
       SET batch_id=$1, sample_date=$2, crop_name=$3, batch_code=$4, stage=$5, sent_date=$6, received_date=$7, status=$8, govt_certificate=$9, certificate_no=$10, reason=$11, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$12 RETURNING *`,
      [batchId, sampleDate, cropName, batchName, stage, sentDate, receivedDate, status, govtCertificate, certificateNo, reason, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSampling = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM sampling WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getSampling, createSampling, updateSampling, deleteSampling };
