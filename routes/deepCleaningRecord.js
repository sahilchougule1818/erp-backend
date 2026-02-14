const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getDeepCleaningRecord, createDeepCleaningRecord, updateDeepCleaningRecord, deleteDeepCleaningRecord } = require('../controllers/deepCleaningRecordController');

router.get('/', authMiddleware, getDeepCleaningRecord);
router.post('/', authMiddleware, createDeepCleaningRecord);
router.put('/:id', authMiddleware, updateDeepCleaningRecord);
router.delete('/:id', authMiddleware, deleteDeepCleaningRecord);

module.exports = router;
