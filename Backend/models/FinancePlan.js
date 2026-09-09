const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FinancePlan = sequelize.define('FinancePlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  applicationId: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  vehiclePrice: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  downPayment: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  financedAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  frequency: { type: DataTypes.STRING(20), allowNull: false },
  installmentAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  totalPayable: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
}, { tableName: 'finance_plans', timestamps: true });

module.exports = FinancePlan;
