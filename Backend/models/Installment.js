const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Installment = sequelize.define('Installment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  financePlanId: { type: DataTypes.INTEGER, allowNull: false },
  number: { type: DataTypes.INTEGER, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  paidAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'PENDING' },
}, { tableName: 'installments', timestamps: true });

module.exports = Installment;
