const express = require('express');
const router = express.Router();
const primaryHardeningController = require('../controllers/primaryHardeningController');
const secondaryHardeningController = require('../controllers/secondaryHardeningController');
const outdoorController = require('../controllers/outdoorController');

// Primary Hardening
router.get('/primary-hardening', primaryHardeningController.getAll);
router.get('/primary-hardening/:id/trays', primaryHardeningController.getTrayDetails);
router.post('/primary-hardening', primaryHardeningController.create);
router.put('/primary-hardening/:id', primaryHardeningController.update);
router.delete('/primary-hardening/:id', primaryHardeningController.delete);

// Secondary Hardening
router.get('/secondary-hardening', secondaryHardeningController.getAll);
router.post('/secondary-hardening', secondaryHardeningController.create);
router.put('/secondary-hardening/:id', secondaryHardeningController.update);
router.delete('/secondary-hardening/:id', secondaryHardeningController.delete);

// Shifting
router.get('/shifting', outdoorController.shifting.getAll);
router.post('/shifting', outdoorController.shifting.create);
router.put('/shifting/:id', outdoorController.shifting.update);
router.delete('/shifting/:id', outdoorController.shifting.delete);

// Outdoor Mortality
router.get('/outdoor-mortality', outdoorController.outdoorMortality.getAll);
router.post('/outdoor-mortality', outdoorController.outdoorMortality.create);
router.put('/outdoor-mortality/:id', outdoorController.outdoorMortality.update);
router.delete('/outdoor-mortality/:id', outdoorController.outdoorMortality.delete);

// Fertilization
router.get('/fertilization', outdoorController.fertilization.getAll);
router.post('/fertilization', outdoorController.fertilization.create);
router.put('/fertilization/:id', outdoorController.fertilization.update);
router.delete('/fertilization/:id', outdoorController.fertilization.delete);

// Holding Area
router.get('/holding-area', outdoorController.holdingArea.getAll);
router.post('/holding-area', outdoorController.holdingArea.create);
router.put('/holding-area/:id', outdoorController.holdingArea.update);
router.delete('/holding-area/:id', outdoorController.holdingArea.delete);

// Outdoor Sampling
router.get('/outdoor-sampling', outdoorController.outdoorSampling.getAll);
router.post('/outdoor-sampling', outdoorController.outdoorSampling.create);
router.put('/outdoor-sampling/:id', outdoorController.outdoorSampling.update);
router.delete('/outdoor-sampling/:id', outdoorController.outdoorSampling.delete);

module.exports = router;
