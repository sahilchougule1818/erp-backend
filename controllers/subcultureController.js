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
    const { transferDate, stageNumber, batchName, mediaCode, cropName, noOfBottles, noOfShoots, operatorName, mortality, remark } = req.body;
    
    const result = await pool.query(
      `INSERT INTO subculturing (transfer_date, stage_number, batch_name, media_code, crop_name, no_of_bottles, no_of_shoots, operator_name, mortality, remark) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [transferDate, stageNumber, batchName, mediaCode, cropName, noOfBottles, noOfShoots, operatorName, mortality, remark]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSubculturing = async (req, res) => {
  try {
    const { id } = req.params;
    const { transferDate, stageNumber, batchName, mediaCode, cropName, noOfBottles, noOfShoots, operatorName, mortality, remark } = req.body;
    
    const result = await pool.query(
      `UPDATE subculturing 
       SET transfer_date=$1, stage_number=$2, batch_name=$3, media_code=$4, crop_name=$5, no_of_bottles=$6, no_of_shoots=$7, operator_name=$8, mortality=$9, remark=$10, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$11 RETURNING *`,
      [transferDate, stageNumber, batchName, mediaCode, cropName, noOfBottles, noOfShoots, operatorName, mortality, remark, id]
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
