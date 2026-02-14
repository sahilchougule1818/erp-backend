const pool = require('../config/db');

const getIncubation = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incubation ORDER BY subculture_date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createIncubation = async (req, res) => {
  try {
    const { subcultureDate, stage, batchName, mediaCode, operatorName, cropName, noOfBottles, noOfShoots, temp, humidity, photoPeriod, lightIntensity } = req.body;
    
    const result = await pool.query(
      `INSERT INTO incubation (subculture_date, stage, batch_name, media_code, operator_name, crop_name, no_of_bottles, no_of_shoots, temp, humidity, photo_period, light_intensity) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [subcultureDate, stage, batchName, mediaCode, operatorName, cropName, noOfBottles, noOfShoots, temp, humidity, photoPeriod, lightIntensity]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateIncubation = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcultureDate, stage, batchName, mediaCode, operatorName, cropName, noOfBottles, noOfShoots, temp, humidity, photoPeriod, lightIntensity } = req.body;
    
    const result = await pool.query(
      `UPDATE incubation 
       SET subculture_date=$1, stage=$2, batch_name=$3, media_code=$4, operator_name=$5, crop_name=$6, no_of_bottles=$7, no_of_shoots=$8, temp=$9, humidity=$10, photo_period=$11, light_intensity=$12, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$13 RETURNING *`,
      [subcultureDate, stage, batchName, mediaCode, operatorName, cropName, noOfBottles, noOfShoots, temp, humidity, photoPeriod, lightIntensity, id]
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
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM incubation WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getIncubation, createIncubation, updateIncubation, deleteIncubation };
