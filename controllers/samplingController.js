const pool = require('../config/db');

const getSampling = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sampling ORDER BY date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSampling = async (req, res) => {
  try {
    const { date, mediaCode, operator, typeOfMedia, bottlesUsed, explantsInoculated, contamination } = req.body;
    
    const result = await pool.query(
      `INSERT INTO sampling (date, media_code, operator, type_of_media, bottles_used, explants_inoculated, contamination) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [date, mediaCode, operator, typeOfMedia, bottlesUsed, explantsInoculated, contamination]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSampling = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, mediaCode, operator, typeOfMedia, bottlesUsed, explantsInoculated, contamination } = req.body;
    
    const result = await pool.query(
      `UPDATE sampling 
       SET date=$1, media_code=$2, operator=$3, type_of_media=$4, bottles_used=$5, explants_inoculated=$6, contamination=$7, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$8 RETURNING *`,
      [date, mediaCode, operator, typeOfMedia, bottlesUsed, explantsInoculated, contamination, id]
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
