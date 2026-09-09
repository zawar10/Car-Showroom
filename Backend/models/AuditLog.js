const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING(80), allowNull: false },
  entity: { type: DataTypes.STRING(50), allowNull: false },
  entityId: { type: DataTypes.STRING(60), allowNull: false },
  actorId: DataTypes.INTEGER,
  details: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
}, { tableName: 'audit_logs', timestamps: true });

module.exports = AuditLog;
