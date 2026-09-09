const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Setting = sequelize.define('Setting', {
  key: { type: DataTypes.STRING(80), primaryKey: true },
  value: { type: DataTypes.JSONB, allowNull: false },
}, { tableName: 'settings', timestamps: true });
module.exports = Setting;
