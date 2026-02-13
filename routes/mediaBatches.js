const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getMediaBatches, createMediaBatch, updateMediaBatch, deleteMediaBatch } = require('../controllers/mediaBatchController');

router.get('/', authMiddleware, getMediaBatches);
router.post('/', authMiddleware, createMediaBatch);
router.put('/:id', authMiddleware, updateMediaBatch);
router.delete('/:id', authMiddleware, deleteMediaBatch);

module.exports = router;
