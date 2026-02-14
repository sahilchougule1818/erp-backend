const pool = require('../config/db');

const getAutoclaveCycles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM autoclave_cycles ORDER BY date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createAutoclaveCycle = async (req, res) => {
  try {
    const { date, mediaCode, operatorName, typeOfMedia, autoclaveOnTime, mediaLoadingTime, pressureTime, offTime, openTime, mediaTotal, remark } = req.body;
    
    const result = await pool.query(
      `INSERT INTO autoclave_cycles (date, media_code, operator_name, type_of_media, autoclave_on_time, media_loading_time, pressure_time, off_time, open_time, media_total, remark) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [date, mediaCode, operatorName, typeOfMedia, autoclaveOnTime, mediaLoadingTime, pressureTime, offTime, openTime, mediaTotal, remark]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAutoclaveCycle = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, mediaCode, operatorName, typeOfMedia, autoclaveOnTime, mediaLoadingTime, pressureTime, offTime, openTime, mediaTotal, remark } = req.body;
    
    const result = await pool.query(
      `UPDATE autoclave_cycles 
       SET date=$1, media_code=$2, operator_name=$3, type_of_media=$4, autoclave_on_time=$5, media_loading_time=$6, pressure_time=$7, off_time=$8, open_time=$9, media_total=$10, remark=$11, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$12 RETURNING *`,
      [date, mediaCode, operatorName, typeOfMedia, autoclaveOnTime, mediaLoadingTime, pressureTime, offTime, openTime, mediaTotal, remark, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAutoclaveCycle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM autoclave_cycles WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAutoclaveCycles, createAutoclaveCycle, updateAutoclaveCycle, deleteAutoclaveCycle };
