const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getIncubation, createIncubation, updateIncubation, deleteIncubation } = require('../controllers/incubationController');

router.get('/', authMiddleware, getIncubation);
router.post('/', authMiddleware, createIncubation);
router.put('/:id', authMiddleware, updateIncubation);
router.delete('/:id', authMiddleware, deleteIncubation);

module.exports = router;
