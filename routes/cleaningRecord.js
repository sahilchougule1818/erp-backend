const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getCleaningRecord, createCleaningRecord, updateCleaningRecord, deleteCleaningRecord } = require('../controllers/cleaningRecordController');

router.get('/', authMiddleware, getCleaningRecord);
router.post('/', authMiddleware, createCleaningRecord);
router.put('/:id', authMiddleware, updateCleaningRecord);
router.delete('/:id', authMiddleware, deleteCleaningRecord);

module.exports = router;
