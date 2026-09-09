const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paymentNumber: { type: DataTypes.STRING(40), unique: true, allowNull: false },
  applicationId: { type: DataTypes.INTEGER, allowNull: false },
  installmentId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  paymentDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  method: { type: DataTypes.STRING(30), allowNull: false },
  reference: DataTypes.STRING(120),
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'CONFIRMED' },
  recordedById: DataTypes.INTEGER,
}, { tableName: 'payments', timestamps: true });

module.exports = Payment;
