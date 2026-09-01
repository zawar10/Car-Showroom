const sequelize = require('../config/db');
const User = require('./User');

const models = { sequelize, User };

module.exports = models;
