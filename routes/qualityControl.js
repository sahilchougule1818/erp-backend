const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getQualityControl, createQualityControl, updateQualityControl, deleteQualityControl } = require('../controllers/qualityControlController');

router.get('/', authMiddleware, getQualityControl);
router.post('/', authMiddleware, createQualityControl);
router.put('/:id', authMiddleware, updateQualityControl);
router.delete('/:id', authMiddleware, deleteQualityControl);

module.exports = router;
