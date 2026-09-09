const { Setting, Supplier } = require('../models');
const { isAdmin } = require('../middleware/roleMiddleware');

const listSuppliers = async (req, res, next) => { try { return res.json({ success: true, data: await Supplier.findAll({ order: [['createdAt', 'DESC']] }) }); } catch (error) { return next(error); } };
const getSettings = async (req, res, next) => { try { const rows = await Setting.findAll(); const data = Object.fromEntries(rows.map(row => [row.key, row.value])); return res.json({ success: true, data }); } catch (error) { return next(error); } };
const saveSettings = async (req, res, next) => { try { if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'Only an Admin can update settings.' }); for (const [key, value] of Object.entries(req.body)) await Setting.upsert({ key, value }); return getSettings(req, res, next); } catch (error) { return next(error); } };
module.exports = { listSuppliers, getSettings, saveSettings };
