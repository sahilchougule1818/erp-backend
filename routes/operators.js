const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// GET /api/operators - Get all operators
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM operators ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/operators/section/:sectionName - Get operators by section
router.get('/section/:sectionName', async (req, res) => {
  try {
    const { sectionName } = req.params;
    const result = await pool.query(
      `SELECT * FROM operators 
       WHERE section = $1 
       AND is_active = TRUE 
       ORDER BY short_name`,
      [sectionName]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/operators - Create operator
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, shortName, role, section, isActive } = req.body;
    const result = await pool.query(
      `INSERT INTO operators 
       (first_name, last_name, short_name, role, section, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [firstName, lastName, shortName, role, section, isActive]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/operators/:id - Update operator
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, shortName, role, section, isActive } = req.body;
    const result = await pool.query(
      `UPDATE operators 
       SET first_name=$1, last_name=$2, short_name=$3, role=$4, section=$5, is_active=$6 
       WHERE id=$7 
       RETURNING *`,
      [firstName, lastName, shortName, role, section, isActive, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/operators/:id - Delete operator
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM operators WHERE id = $1', [id]);
    res.json({ message: 'Operator deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;