const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getSampling, createSampling, updateSampling, deleteSampling } = require('../controllers/samplingController');

router.get('/', authMiddleware, getSampling);
router.post('/', authMiddleware, createSampling);
router.put('/:id', authMiddleware, updateSampling);
router.delete('/:id', authMiddleware, deleteSampling);

module.exports = router;
