const pool = require('../config/db');

const getMediaBatches = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media_batches ORDER BY date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createMediaBatch = async (req, res) => {
  try {
    const { date, mediaCode, operatorName, quantity, bottles, contamination } = req.body;
    
    const result = await pool.query(
      `INSERT INTO media_batches (date, media_code, operator_name, quantity, bottles, contamination) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [date, mediaCode, operatorName, quantity, bottles, contamination]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMediaBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, mediaCode, operatorName, quantity, bottles, contamination } = req.body;
    
    const result = await pool.query(
      `UPDATE media_batches 
       SET date=$1, media_code=$2, operator_name=$3, quantity=$4, bottles=$5, contamination=$6, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$7 RETURNING *`,
      [date, mediaCode, operatorName, quantity, bottles, contamination, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMediaBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM media_batches WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMediaBatches, createMediaBatch, updateMediaBatch, deleteMediaBatch };
