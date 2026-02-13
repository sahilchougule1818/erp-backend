const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getSubculturing, createSubculturing, updateSubculturing, deleteSubculturing } = require('../controllers/subcultureController');

router.get('/', authMiddleware, getSubculturing);
router.post('/', authMiddleware, createSubculturing);
router.put('/:id', authMiddleware, updateSubculturing);
router.delete('/:id', authMiddleware, deleteSubculturing);

module.exports = router;
