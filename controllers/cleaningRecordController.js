const pool = require('../config/db');

const getCleaningRecord = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cleaning_record ORDER BY date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCleaningRecord = async (req, res) => {
  try {
    const { date, operatorName, areaCleaned } = req.body;
    
    const result = await pool.query(
      `INSERT INTO cleaning_record (date, operator_name, area) 
       VALUES ($1, $2, $3) RETURNING *`,
      [date, operatorName, areaCleaned]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCleaningRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, operatorName, areaCleaned } = req.body;
    
    const result = await pool.query(
      `UPDATE cleaning_record 
       SET date=$1, operator_name=$2, area=$3, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$4 RETURNING *`,
      [date, operatorName, areaCleaned, id]
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
    const result = await pool.query('DELETE FROM cleaning_record WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCleaningRecord, createCleaningRecord, updateCleaningRecord, deleteCleaningRecord };
