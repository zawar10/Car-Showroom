const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/settingsController');
const router = express.Router();
router.use(authMiddleware);
router.get('/suppliers', controller.listSuppliers);
router.get('/', controller.getSettings);
router.put('/', controller.saveSettings);
module.exports = router;
