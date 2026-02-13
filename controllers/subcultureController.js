const pool = require('../config/db');

const getSubculturing = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subculturing ORDER BY transfer_date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSubculturing = async (req, res) => {
  try {
    const { transferDate, mediaCode, operator, typeOfMedia, vesselsUsed, shootsTransferred, contamination } = req.body;
    
    const result = await pool.query(
      `INSERT INTO subculturing (transfer_date, media_code, operator, type_of_media, vessels_used, shoots_transferred, contamination) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [transferDate, mediaCode, operator, typeOfMedia, vesselsUsed, shootsTransferred, contamination]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSubculturing = async (req, res) => {
  try {
    const { id } = req.params;
    const { transferDate, mediaCode, operator, typeOfMedia, vesselsUsed, shootsTransferred, contamination } = req.body;
    
    const result = await pool.query(
      `UPDATE subculturing 
       SET transfer_date=$1, media_code=$2, operator=$3, type_of_media=$4, vessels_used=$5, shoots_transferred=$6, contamination=$7, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$8 RETURNING *`,
      [transferDate, mediaCode, operator, typeOfMedia, vesselsUsed, shootsTransferred, contamination, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSubculturing = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM subculturing WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getSubculturing, createSubculturing, updateSubculturing, deleteSubculturing };
