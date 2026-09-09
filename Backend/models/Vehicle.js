const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  legacyId: { type: DataTypes.STRING(40), unique: true },
  make: { type: DataTypes.STRING(100), allowNull: false },
  model: { type: DataTypes.STRING(100), allowNull: false },
  variant: { type: DataTypes.STRING(100), allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  sellingPrice: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  purchaseRate: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'AVAILABLE' },
  fuel: DataTypes.STRING(40),
  transmission: DataTypes.STRING(40),
  mileage: DataTypes.STRING(60),
  engine: DataTypes.STRING(60),
  colors: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  images: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  description: DataTypes.TEXT,
  supplierId: DataTypes.STRING(100),
}, { tableName: 'vehicles', timestamps: true });

module.exports = Vehicle;
