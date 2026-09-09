const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/accountController');

const router = express.Router();
router.use(authMiddleware);
router.get('/customers', controller.customers);
router.get('/profile', controller.profile);
router.get('/notifications', controller.notifications);
router.patch('/notifications/:id/read', controller.markNotificationRead);
module.exports = router;
