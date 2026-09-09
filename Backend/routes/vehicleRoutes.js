const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { listVehicles, getVehicle } = require('../controllers/vehicleController');

const router = express.Router();
router.get('/', listVehicles);
router.get('/:id', authMiddleware, getVehicle);
router.post('/', authMiddleware, (req, res, next) => require('../controllers/vehicleController').saveVehicle(req, res, next));
router.put('/:id', authMiddleware, (req, res, next) => require('../controllers/vehicleController').saveVehicle(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => require('../controllers/vehicleController').deleteVehicle(req, res, next));

module.exports = router;
