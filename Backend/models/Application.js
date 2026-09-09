const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  applicationNumber: { type: DataTypes.STRING(40), unique: true, allowNull: false },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  vehicleId: { type: DataTypes.INTEGER, allowNull: false },
  managerId: DataTypes.INTEGER,
  selectedColor: DataTypes.STRING(60),
  remarks: DataTypes.TEXT,
  status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'PENDING' },
  verificationStatus: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'PENDING_VERIFICATION' },
  financeStatus: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'NOT_STARTED' },
  paymentStatus: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'NOT_STARTED' },
  assignedAt: DataTypes.DATE,
  verifiedAt: DataTypes.DATE,
}, { tableName: 'applications', timestamps: true });

module.exports = Application;
