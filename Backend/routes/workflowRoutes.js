const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const controller = require('../controllers/workflowController');

const router = express.Router();
router.use(authMiddleware);
router.get('/managers', roleMiddleware('Admin', 'SUPER_ADMIN', 'SUPER ADMIN'), controller.listManagers);
router.get('/', controller.listApplications);
router.post('/', controller.createApplication);
router.get('/:id', controller.getApplicationDetails);
router.patch('/:id/status', controller.changeStatus);
router.patch('/:id/assign-manager', controller.assignManager);
router.patch('/:id/verify-customer', controller.verifyCustomer);
router.patch('/:id/vehicle', controller.selectVehicle);
router.post('/:id/finance', controller.createFinance);
router.get('/:id/finance', controller.getFinance);
router.post('/:id/payments', controller.recordPayment);

module.exports = router;
