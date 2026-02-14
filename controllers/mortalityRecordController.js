const pool = require('../config/db');

const getMortalityRecord = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mortality_record ORDER BY date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createMortalityRecord = async (req, res) => {
  try {
    const { date, batchName, vesselCount, typeOfMortality, possibleSource, disposalMethod } = req.body;
    
    const result = await pool.query(
      `INSERT INTO mortality_record (date, batch_name, vessel_count, type_of_mortality, possible_source, disposal_method) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [date, batchName, vesselCount, typeOfMortality, possibleSource, disposalMethod]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMortalityRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, batchName, vesselCount, typeOfMortality, possibleSource, disposalMethod } = req.body;
    
    const result = await pool.query(
      `UPDATE mortality_record 
       SET date=$1, batch_name=$2, vessel_count=$3, type_of_mortality=$4, possible_source=$5, disposal_method=$6, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$7 RETURNING *`,
      [date, batchName, vesselCount, typeOfMortality, possibleSource, disposalMethod, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMortalityRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM mortality_record WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMortalityRecord, createMortalityRecord, updateMortalityRecord, deleteMortalityRecord };
