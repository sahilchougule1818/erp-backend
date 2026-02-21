const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

router.get('/indoor-batches', batchController.getIndoorBatches);
router.get('/outdoor-ready-batches', batchController.getOutdoorReadyBatches);
router.post('/transfer-to-outdoor/:batchCode', batchController.transferToOutdoor);
router.post('/undo-outdoor-transfer/:batchCode', batchController.undoOutdoorTransfer);
router.post('/recalculate-current-data', batchController.recalculateCurrentData);

module.exports = router;
