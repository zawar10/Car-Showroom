const { Op } = require('sequelize');
const {
  User, Vehicle, Application, FinancePlan, Installment, Payment, AuditLog,
} = require('../models');
const { isAdmin, isManager } = require('../middleware/roleMiddleware');

const TRANSITIONS = {
  PENDING: ['APPROVED', 'REJECTED'],
  APPROVED: ['ASSIGNED'],
  ASSIGNED: ['IN_PROCESS'],
  IN_PROCESS: ['VEHICLE_SELECTED'],
  VEHICLE_SELECTED: ['FINANCE_SETUP'],
  FINANCE_SETUP: ['PAYMENT_IN_PROGRESS'],
  PAYMENT_IN_PROGRESS: ['READY_FOR_DELIVERY'],
  READY_FOR_DELIVERY: ['COMPLETED'],
  REJECTED: [],
  COMPLETED: [],
};

const includeGraph = [
  { model: User, as: 'customer', attributes: { exclude: ['password'] } },
  { model: User, as: 'manager', attributes: { exclude: ['password'] } },
  { model: Vehicle, as: 'vehicle' },
  { model: FinancePlan, as: 'financePlan', include: [{ model: Installment, as: 'installments' }] },
  { model: Payment, as: 'payments' },
];

const logAction = (action, entity, entityId, actorId, details = {}) => AuditLog.create({ action, entity, entityId: String(entityId), actorId, details });
const canSeeApplication = (user, application) => isAdmin(user.role) || (user.role === 'Customer' && application.customerId === user.userId) || (isManager(user.role) && application.managerId === user.userId);
const getApplication = (id) => Application.findByPk(id, { include: includeGraph });
const serializeApplication = (application) => {
  if (!application) return application;
  const data = application.toJSON();
  const totalPaid = (data.payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const financedAmount = Number(data.financePlan?.financedAmount || 0);
  return { ...data, totalPaid, remainingBalance: Math.max(0, financedAmount - totalPaid) };
};

const listApplications = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'Customer') where.customerId = req.user.userId;
    else if (isManager(req.user.role)) where.managerId = req.user.userId;
    if (req.query.status) where.status = req.query.status;
    const applications = await Application.findAll({ where, include: includeGraph, order: [['createdAt', 'DESC']] });
    return res.json({ success: true, data: applications.map(serializeApplication) });
  } catch (error) { return next(error); }
};

const getApplicationDetails = async (req, res, next) => {
  try {
    const application = await getApplication(req.params.id);
    if (!application || !canSeeApplication(req.user, application)) return res.status(404).json({ success: false, message: 'Application not found' });
    return res.json({ success: true, data: serializeApplication(application) });
  } catch (error) { return next(error); }
};

const createApplication = async (req, res, next) => {
  try {
    if (req.user.role !== 'Customer') return res.status(403).json({ success: false, message: 'Only customers can submit applications.' });
    const { vehicleId, selectedColor, remarks } = req.body;
    const vehicle = /^\d+$/.test(String(vehicleId))
      ? await Vehicle.findByPk(Number(vehicleId))
      : await Vehicle.findOne({ where: { legacyId: vehicleId } });
    if (!vehicle || vehicle.status !== 'AVAILABLE' || vehicle.stock < 1) return res.status(400).json({ success: false, message: 'This vehicle is no longer available.' });
    const application = await Application.create({ applicationNumber: `APP-${Date.now()}`, customerId: req.user.userId, vehicleId: vehicle.id, selectedColor, remarks, status: 'PENDING' });
    await logAction('APPLICATION_SUBMITTED', 'Application', application.id, req.user.userId);
    return res.status(201).json({ success: true, message: 'Application submitted successfully.', data: serializeApplication(await getApplication(application.id)) });
  } catch (error) { return next(error); }
};

const changeStatus = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role) && !isManager(req.user.role)) return res.status(403).json({ success: false, message: 'You are not authorized to change application status.' });
    const application = await Application.findByPk(req.params.id);
    const nextStatus = req.body.status;
    if (!application || !TRANSITIONS[application.status]?.includes(nextStatus)) return res.status(400).json({ success: false, message: `Invalid transition from ${application?.status || 'unknown'} to ${nextStatus}.` });
    if (isManager(req.user.role) && application.managerId !== req.user.userId) return res.status(403).json({ success: false, message: 'You can only update assigned applications.' });
    application.status = nextStatus;
    if (req.body.remarks !== undefined) application.remarks = req.body.remarks;
    await application.save();
    await logAction(`APPLICATION_${nextStatus}`, 'Application', application.id, req.user.userId, { remarks: req.body.remarks });
    return res.json({ success: true, data: serializeApplication(await getApplication(application.id)) });
  } catch (error) { return next(error); }
};

const assignManager = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'Only an Admin can assign managers.' });
    const [application, manager] = await Promise.all([Application.findByPk(req.params.id), User.findByPk(req.body.managerId)]);
    if (!application || !manager || !isManager(manager.role) || manager.status !== 'Active') return res.status(400).json({ success: false, message: 'Select an active manager.' });
    if (application.status !== 'APPROVED') return res.status(400).json({ success: false, message: 'Only approved applications can be assigned.' });
    application.managerId = manager.id;
    application.assignedAt = new Date();
    application.status = 'ASSIGNED';
    await application.save();
    await logAction('MANAGER_ASSIGNED', 'Application', application.id, req.user.userId, { managerId: manager.id });
    return res.json({ success: true, data: serializeApplication(await getApplication(application.id)) });
  } catch (error) { return next(error); }
};

const verifyCustomer = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application || !isManager(req.user.role) || application.managerId !== req.user.userId) return res.status(403).json({ success: false, message: 'You can only verify assigned applications.' });
    if (!['PENDING_VERIFICATION', 'REQUIRES_CORRECTION'].includes(application.verificationStatus)) return res.status(400).json({ success: false, message: 'Customer verification is already complete.' });
    application.verificationStatus = req.body.verificationStatus;
    application.verifiedAt = req.body.verificationStatus === 'VERIFIED' ? new Date() : null;
    if (application.verificationStatus === 'VERIFIED' && application.status === 'ASSIGNED') application.status = 'IN_PROCESS';
    await application.save();
    await logAction('CUSTOMER_VERIFIED', 'Application', application.id, req.user.userId, { verificationStatus: application.verificationStatus });
    return res.json({ success: true, data: serializeApplication(await getApplication(application.id)) });
  } catch (error) { return next(error); }
};

const selectVehicle = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application || !isManager(req.user.role) || application.managerId !== req.user.userId) return res.status(403).json({ success: false, message: 'You can only select vehicles for assigned applications.' });
    const vehicle = await Vehicle.findByPk(req.body.vehicleId);
    if (!vehicle || vehicle.status !== 'AVAILABLE' || vehicle.stock < 1) return res.status(400).json({ success: false, message: 'This vehicle is no longer available.' });
    application.vehicleId = vehicle.id;
    application.status = 'VEHICLE_SELECTED';
    await application.save();
    await logAction('VEHICLE_SELECTED', 'Application', application.id, req.user.userId, { vehicleId: vehicle.id });
    return res.json({ success: true, data: serializeApplication(await getApplication(application.id)) });
  } catch (error) { return next(error); }
};

const createFinance = async (req, res, next) => {
  const transaction = await Application.sequelize.transaction();
  try {
    const application = await Application.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!application || !isManager(req.user.role) || application.managerId !== req.user.userId) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: 'You can only configure assigned applications.' });
    }
    if (!['VEHICLE_SELECTED', 'IN_PROCESS'].includes(application.status)) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Vehicle selection must be completed first.' });
    }
    const vehicle = await Vehicle.findByPk(application.vehicleId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!vehicle || vehicle.status !== 'AVAILABLE' || vehicle.stock < 1) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'This vehicle is no longer available.' });
    }
    const duration = Number(req.body.duration);
    const downPayment = Number(req.body.downPayment);
    const frequency = req.body.frequency;
    if (!Number.isInteger(duration) || duration < 1 || !['MONTHLY', 'QUARTERLY'].includes(frequency)) throw Object.assign(new Error('Invalid finance plan.'), { statusCode: 400 });
    const vehiclePrice = Number(vehicle.sellingPrice);
    if (downPayment < 0 || downPayment >= vehiclePrice) throw Object.assign(new Error('Down payment must be below the vehicle price.'), { statusCode: 400 });
    const periods = frequency === 'MONTHLY' ? duration : Math.ceil(duration / 3);
    const financedAmount = vehiclePrice - downPayment;
    const installmentAmount = Number((financedAmount / periods).toFixed(2));
    const plan = await FinancePlan.create({ applicationId: application.id, vehiclePrice, downPayment, financedAmount, duration, frequency, installmentAmount, totalPayable: financedAmount }, { transaction });
    for (let index = 1; index <= periods; index += 1) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + (frequency === 'MONTHLY' ? index : index * 3));
      await Installment.create({ financePlanId: plan.id, number: index, dueDate, amount: index === periods ? financedAmount - installmentAmount * (periods - 1) : installmentAmount }, { transaction });
    }
    application.status = 'FINANCE_SETUP';
    application.financeStatus = 'ACTIVE';
    await application.save({ transaction });
    await logAction('FINANCE_CREATED', 'Application', application.id, req.user.userId, { financePlanId: plan.id });
    await transaction.commit();
    return res.status(201).json({ success: true, data: serializeApplication(await getApplication(application.id)) });
  } catch (error) { await transaction.rollback(); return next(error); }
};

const getFinance = async (req, res, next) => {
  try {
    const application = await getApplication(req.params.id);
    if (!application || !canSeeApplication(req.user, application)) return res.status(404).json({ success: false, message: 'Application not found' });
    return res.json({ success: true, data: application.financePlan || null });
  } catch (error) { return next(error); }
};

const recordPayment = async (req, res, next) => {
  const transaction = await Application.sequelize.transaction();
  try {
    const application = await Application.findByPk(req.body.applicationId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!application || !isManager(req.user.role) || application.managerId !== req.user.userId) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: 'You can only record payments for assigned applications.' });
    }
    const financePlan = await FinancePlan.findOne({ where: { applicationId: application.id }, transaction, lock: transaction.LOCK.UPDATE });
    const installments = financePlan ? await Installment.findAll({ where: { financePlanId: financePlan.id }, transaction, lock: transaction.LOCK.UPDATE }) : [];
    const installment = installments.find((item) => item.id === Number(req.body.installmentId));
    const amount = Number(req.body.amount);
    if (!installment || amount <= 0 || Number(installment.paidAmount) + amount > Number(installment.amount)) throw Object.assign(new Error('Payment exceeds remaining installment balance.'), { statusCode: 400 });
    const payment = await Payment.create({ paymentNumber: `PAY-${Date.now()}`, applicationId: application.id, installmentId: installment.id, amount, method: req.body.method, reference: req.body.reference, recordedById: req.user.userId }, { transaction });
    installment.paidAmount = Number(installment.paidAmount) + amount;
    installment.status = Number(installment.paidAmount) >= Number(installment.amount) ? 'PAID' : 'PARTIAL';
    await installment.save({ transaction });
    const allPaid = installments.every((item) => item.id === installment.id ? installment.status === 'PAID' : item.status === 'PAID');
    application.paymentStatus = allPaid ? 'PAID' : 'IN_PROGRESS';
    application.status = allPaid ? 'READY_FOR_DELIVERY' : 'PAYMENT_IN_PROGRESS';
    await application.save({ transaction });
    await logAction('PAYMENT_RECORDED', 'Application', application.id, req.user.userId, { paymentId: payment.id });
    await transaction.commit();
    return res.status(201).json({ success: true, data: serializeApplication(await getApplication(application.id)) });
  } catch (error) { await transaction.rollback(); return next(error); }
};

const listManagers = async (req, res, next) => {
  try { const managers = await User.findAll({ where: { status: 'Active', role: { [Op.in]: ['Manager', 'Sales Manager'] } }, attributes: ['id', 'name', 'email', 'role'] }); return res.json({ success: true, data: managers }); } catch (error) { return next(error); }
};

module.exports = { listApplications, getApplicationDetails, createApplication, changeStatus, assignManager, verifyCustomer, selectVehicle, createFinance, getFinance, recordPayment, listManagers };
