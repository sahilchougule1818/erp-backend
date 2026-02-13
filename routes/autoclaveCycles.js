const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAutoclaveCycles, createAutoclaveCycle, updateAutoclaveCycle, deleteAutoclaveCycle } = require('../controllers/autoclaveCycleController');

router.get('/', authMiddleware, getAutoclaveCycles);
router.post('/', authMiddleware, createAutoclaveCycle);
router.put('/:id', authMiddleware, updateAutoclaveCycle);
router.delete('/:id', authMiddleware, deleteAutoclaveCycle);

module.exports = router;
