const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { dashboard, auditLogs } = require('../controllers/dashboardController');

const router = express.Router();
router.use(authMiddleware);
router.get('/', dashboard);
router.get('/audit', auditLogs);

module.exports = router;
