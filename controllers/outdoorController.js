const pool = require('../config/db');

// SHIFTING CONTROLLER
exports.shifting = {
  getAll: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM shifting ORDER BY date DESC, created_at DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { date, cropName, batchName, oldLocation, newLocation, plants, reason, notes } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `INSERT INTO shifting (batch_id, date, batch_code, crop_name, old_location, new_location, plants, reason, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [batchId, date, batchName, cropName, oldLocation, newLocation, plants, reason, notes]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, cropName, batchName, oldLocation, newLocation, plants, reason, notes } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `UPDATE shifting SET batch_id=$1, date=$2, batch_code=$3, crop_name=$4, old_location=$5, new_location=$6, plants=$7, reason=$8, notes=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10 RETURNING *`,
        [batchId, date, batchName, cropName, oldLocation, newLocation, plants, reason, notes, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await pool.query('DELETE FROM shifting WHERE id=$1', [req.params.id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// OUTDOOR MORTALITY CONTROLLER
exports.outdoorMortality = {
  getAll: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM outdoor_mortality ORDER BY date DESC, created_at DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { date, cropName, batchName, location, mortalityType, affectedPlants, actionTaken, notes } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `INSERT INTO outdoor_mortality (batch_id, date, batch_code, crop_name, location, mortality_type, affected_plants, action_taken, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [batchId, date, batchName, cropName, location, mortalityType, affectedPlants, actionTaken, notes]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, cropName, batchName, location, mortalityType, affectedPlants, actionTaken, notes } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `UPDATE outdoor_mortality SET batch_id=$1, date=$2, batch_code=$3, crop_name=$4, location=$5, mortality_type=$6, affected_plants=$7, action_taken=$8, notes=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10 RETURNING *`,
        [batchId, date, batchName, cropName, location, mortalityType, affectedPlants, actionTaken, notes, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await pool.query('DELETE FROM outdoor_mortality WHERE id=$1', [req.params.id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// FERTILIZATION CONTROLLER
exports.fertilization = {
  getAll: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM fertilization ORDER BY date DESC, created_at DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { date, cropName, batchName, activityType, materialsUsed, quantity, operatorName, notes } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `INSERT INTO fertilization (batch_id, date, batch_code, crop_name, activity_type, materials_used, quantity, operator_name, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [batchId, date, batchName, cropName, activityType, materialsUsed, quantity, operatorName, notes]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, cropName, batchName, activityType, materialsUsed, quantity, operatorName, notes } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `UPDATE fertilization SET batch_id=$1, date=$2, batch_code=$3, crop_name=$4, activity_type=$5, materials_used=$6, quantity=$7, operator_name=$8, notes=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10 RETURNING *`,
        [batchId, date, batchName, cropName, activityType, materialsUsed, quantity, operatorName, notes, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await pool.query('DELETE FROM fertilization WHERE id=$1', [req.params.id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// HOLDING AREA CONTROLLER
exports.holdingArea = {
  getAll: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM holding_area ORDER BY date DESC, created_at DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { date, cropName, batchName, location, plants, status, expectedDispatch, notes } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `INSERT INTO holding_area (batch_id, date, batch_code, crop_name, location, plants, status, expected_dispatch, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [batchId, date, batchName, cropName, location, plants, status, expectedDispatch, notes]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, cropName, batchName, location, plants, status, expectedDispatch, notes } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `UPDATE holding_area SET batch_id=$1, date=$2, batch_code=$3, crop_name=$4, location=$5, plants=$6, status=$7, expected_dispatch=$8, notes=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10 RETURNING *`,
        [batchId, date, batchName, cropName, location, plants, status, expectedDispatch, notes, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await pool.query('DELETE FROM holding_area WHERE id=$1', [req.params.id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// OUTDOOR SAMPLING CONTROLLER
exports.outdoorSampling = {
  getAll: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM outdoor_sampling ORDER BY sample_date DESC, created_at DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { sampleDate, cropName, batchName, stage, sentDate, receivedDate, status, govtCertificate, certificateNo, reason } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `INSERT INTO outdoor_sampling (batch_id, sample_date, batch_code, crop_name, stage, sent_date, received_date, status, govt_certificate, certificate_no, reason)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [batchId, sampleDate, batchName, cropName, stage, sentDate, receivedDate, status, govtCertificate, certificateNo, reason]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { sampleDate, cropName, batchName, stage, sentDate, receivedDate, status, govtCertificate, certificateNo, reason } = req.body;
      
      // Get batch_id from batch_code
      const batchResult = await pool.query('SELECT id FROM batches WHERE batch_code = $1', [batchName]);
      if (batchResult.rows.length === 0) {
        return res.status(400).json({ message: 'Batch not found' });
      }
      const batchId = batchResult.rows[0].id;
      
      const result = await pool.query(
        `UPDATE outdoor_sampling SET batch_id=$1, sample_date=$2, batch_code=$3, crop_name=$4, stage=$5, sent_date=$6, received_date=$7, status=$8, govt_certificate=$9, certificate_no=$10, reason=$11, updated_at=CURRENT_TIMESTAMP WHERE id=$12 RETURNING *`,
        [batchId, sampleDate, batchName, cropName, stage, sentDate, receivedDate, status, govtCertificate, certificateNo, reason, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await pool.query('DELETE FROM outdoor_sampling WHERE id=$1', [req.params.id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
