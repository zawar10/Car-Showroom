const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyName: { type: DataTypes.STRING(160), allowNull: false },
  contactPerson: DataTypes.STRING(120),
  email: DataTypes.STRING(160),
  phone: DataTypes.STRING(40),
  city: DataTypes.STRING(80),
  status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'Active' },
  notes: DataTypes.TEXT,
}, { tableName: 'suppliers', timestamps: true });
module.exports = Supplier;
