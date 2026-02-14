const pool = require('../config/db');

const getCleaningRecord = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quality_control ORDER BY inspection_date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCleaningRecord = async (req, res) => {
  try {
    const { inspectionDate, mediaCode, batchNumber, inspector, qualityStatus, contaminationRate, remarks } = req.body;
    
    const result = await pool.query(
      `INSERT INTO quality_control (inspection_date, media_code, batch_number, inspector, quality_status, contamination_rate, remarks) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [inspectionDate, mediaCode, batchNumber, inspector, qualityStatus, contaminationRate, remarks]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCleaningRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { inspectionDate, mediaCode, batchNumber, inspector, qualityStatus, contaminationRate, remarks } = req.body;
    
    const result = await pool.query(
      `UPDATE quality_control 
       SET inspection_date=$1, media_code=$2, batch_number=$3, inspector=$4, quality_status=$5, contamination_rate=$6, remarks=$7, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$8 RETURNING *`,
      [inspectionDate, mediaCode, batchNumber, inspector, qualityStatus, contaminationRate, remarks, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCleaningRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM quality_control WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCleaningRecord, createCleaningRecord, updateCleaningRecord, deleteCleaningRecord };
