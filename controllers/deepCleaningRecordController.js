const pool = require('../config/db');

const getDeepCleaningRecord = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deep_cleaning_record ORDER BY date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createDeepCleaningRecord = async (req, res) => {
  try {
    const { date, operator, instrumentCleaned } = req.body;
    
    const result = await pool.query(
      `INSERT INTO deep_cleaning_record (date, operator, instrument_cleaned) 
       VALUES ($1, $2, $3) RETURNING *`,
      [date, operator, instrumentCleaned]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDeepCleaningRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, operator, instrumentCleaned } = req.body;
    
    const result = await pool.query(
      `UPDATE deep_cleaning_record 
       SET date=$1, operator=$2, instrument_cleaned=$3, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$4 RETURNING *`,
      [date, operator, instrumentCleaned, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteDeepCleaningRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM deep_cleaning_record WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDeepCleaningRecord, createDeepCleaningRecord, updateDeepCleaningRecord, deleteDeepCleaningRecord };
