const pool = require('../config/db');

const getSampling = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sampling ORDER BY sample_date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSampling = async (req, res) => {
  try {
    const { sampleDate, cropName, batchName, stage, tunnelNo, trayBedNo, sentDate, receivedDate, status, govtCertificate, certificateNo, reason } = req.body;
    
    const result = await pool.query(
      `INSERT INTO sampling (sample_date, crop_name, batch_name, stage, tunnel_no, tray_bed_no, sent_date, received_date, status, govt_certificate, certificate_no, reason) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [sampleDate, cropName, batchName, stage, tunnelNo, trayBedNo, sentDate, receivedDate, status, govtCertificate, certificateNo, reason]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSampling = async (req, res) => {
  try {
    const { id } = req.params;
    const { sampleDate, cropName, batchName, stage, tunnelNo, trayBedNo, sentDate, receivedDate, status, govtCertificate, certificateNo, reason } = req.body;
    
    const result = await pool.query(
      `UPDATE sampling 
       SET sample_date=$1, crop_name=$2, batch_name=$3, stage=$4, tunnel_no=$5, tray_bed_no=$6, sent_date=$7, received_date=$8, status=$9, govt_certificate=$10, certificate_no=$11, reason=$12, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$13 RETURNING *`,
      [sampleDate, cropName, batchName, stage, tunnelNo, trayBedNo, sentDate, receivedDate, status, govtCertificate, certificateNo, reason, id]
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
