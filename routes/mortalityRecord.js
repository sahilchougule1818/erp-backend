const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getMortalityRecord, createMortalityRecord, updateMortalityRecord, deleteMortalityRecord } = require('../controllers/mortalityRecordController');

router.get('/', authMiddleware, getMortalityRecord);
router.post('/', authMiddleware, createMortalityRecord);
router.put('/:id', authMiddleware, updateMortalityRecord);
router.delete('/:id', authMiddleware, deleteMortalityRecord);

module.exports = router;
