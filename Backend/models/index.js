const sequelize = require('../config/db');
const User = require('./User');
const Vehicle = require('./Vehicle');
const Application = require('./Application');
const FinancePlan = require('./FinancePlan');
const Installment = require('./Installment');
const Payment = require('./Payment');
const AuditLog = require('./AuditLog');
const Notification = require('./Notification');
const Supplier = require('./Supplier');
const Setting = require('./Setting');

User.hasMany(Application, { foreignKey: 'customerId', as: 'customerApplications' });
User.hasMany(Application, { foreignKey: 'managerId', as: 'managedApplications' });
Application.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Application.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });
Application.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(Application, { foreignKey: 'vehicleId', as: 'applications' });
Application.hasOne(FinancePlan, { foreignKey: 'applicationId', as: 'financePlan' });
FinancePlan.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });
FinancePlan.hasMany(Installment, { foreignKey: 'financePlanId', as: 'installments' });
Installment.belongsTo(FinancePlan, { foreignKey: 'financePlanId', as: 'financePlan' });
Application.hasMany(Payment, { foreignKey: 'applicationId', as: 'payments' });
Payment.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });
Installment.hasMany(Payment, { foreignKey: 'installmentId', as: 'payments' });
Payment.belongsTo(Installment, { foreignKey: 'installmentId', as: 'installment' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const models = { sequelize, User, Vehicle, Application, FinancePlan, Installment, Payment, AuditLog, Notification, Supplier, Setting };

module.exports = models;
