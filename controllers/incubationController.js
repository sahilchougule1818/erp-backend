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
    const { subcultureDate, mediaCode, operator, typeOfMedia, vesselsCount, shootsCount, growthStatus, contamination } = req.body;
    
    const result = await pool.query(
      `INSERT INTO incubation (subculture_date, media_code, operator, type_of_media, vessels_count, shoots_count, growth_status, contamination) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [subcultureDate, mediaCode, operator, typeOfMedia, vesselsCount, shootsCount, growthStatus, contamination]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateIncubation = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcultureDate, mediaCode, operator, typeOfMedia, vesselsCount, shootsCount, growthStatus, contamination } = req.body;
    
    const result = await pool.query(
      `UPDATE incubation 
       SET subculture_date=$1, media_code=$2, operator=$3, type_of_media=$4, vessels_count=$5, shoots_count=$6, growth_status=$7, contamination=$8, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$9 RETURNING *`,
      [subcultureDate, mediaCode, operator, typeOfMedia, vesselsCount, shootsCount, growthStatus, contamination, id]
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
