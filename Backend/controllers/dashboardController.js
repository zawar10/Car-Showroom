const { Op, fn, col, literal } = require('sequelize');
const { User, Vehicle, Application, FinancePlan, Installment, Payment, AuditLog } = require('../models');
const { isAdmin, isManager } = require('../middleware/roleMiddleware');

const dashboard = async (req, res, next) => {
  try {
    const applicationWhere = req.user.role === 'Customer'
      ? { customerId: req.user.userId }
      : isManager(req.user.role) ? { managerId: req.user.userId } : {};
    const [vehicles, customers, applications, paid, outstanding, overdue] = await Promise.all([
      Vehicle.findAll({ attributes: ['status', [fn('SUM', col('stock')), 'stock']], group: ['status'] }),
      User.count({ where: { role: 'Customer' } }),
      Application.findAll({ where: applicationWhere, attributes: ['status', 'paymentStatus'] }),
      Payment.sum('amount', { include: [{ model: Application, as: 'application', attributes: [], required: true, where: applicationWhere }] }),
      FinancePlan.sum('financedAmount', { include: [{ model: Application, as: 'application', attributes: [], required: true, where: applicationWhere }] }),
      Installment.count({ where: { status: 'OVERDUE' }, include: [{ model: FinancePlan, as: 'financePlan', attributes: [], required: true, include: [{ model: Application, as: 'application', attributes: [], required: true, where: applicationWhere }] }] }),
    ]);
    const byStatus = applications.reduce((result, item) => ({ ...result, [item.status]: (result[item.status] || 0) + 1 }), {});
    const vehicleSummary = vehicles.reduce((result, item) => ({ ...result, [item.status]: Number(item.get('stock') || 0) }), {});
    return res.json({ success: true, data: { totalVehicles: await Vehicle.count(), availableVehicles: vehicleSummary.AVAILABLE || 0, reservedVehicles: vehicleSummary.RESERVED || 0, soldVehicles: vehicleSummary.SOLD || 0, totalCustomers: customers, applications: byStatus, totalRevenue: Number(paid || 0), outstandingBalance: Math.max(0, Number(outstanding || 0) - Number(paid || 0)), overdueInstallments: overdue } });
  } catch (error) { return next(error); }
};

const auditLogs = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'You are not authorized to view audit activity.' });
    const logs = await AuditLog.findAll({ order: [['createdAt', 'DESC']], limit: 100 });
    return res.json({ success: true, data: logs });
  } catch (error) { return next(error); }
};

module.exports = { dashboard, auditLogs };
