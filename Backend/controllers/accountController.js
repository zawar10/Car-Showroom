const { Op } = require('sequelize');
const { User, Notification, Application, Vehicle } = require('../models');
const { isAdmin } = require('../middleware/roleMiddleware');

const customers = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'You are not authorized to view customers.' });
    const users = await User.findAll({ where: { role: 'Customer' }, attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    return res.json({ success: true, data: users });
  } catch (error) { return next(error); }
};
const profile = async (req, res, next) => {
  try { const user = await User.findByPk(req.user.userId, { attributes: { exclude: ['password'] } }); return res.json({ success: true, data: user }); } catch (error) { return next(error); }
};
const notifications = async (req, res, next) => {
  try { const items = await Notification.findAll({ where: { userId: req.user.userId }, order: [['createdAt', 'DESC']] }); return res.json({ success: true, data: items }); } catch (error) { return next(error); }
};
const markNotificationRead = async (req, res, next) => {
  try { const item = await Notification.findOne({ where: { id: req.params.id, userId: req.user.userId } }); if (!item) return res.status(404).json({ success: false, message: 'Notification not found' }); item.read = true; await item.save(); return res.json({ success: true, data: item }); } catch (error) { return next(error); }
};

module.exports = { customers, profile, notifications, markNotificationRead };
