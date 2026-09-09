const { Vehicle, AuditLog } = require('../models');
const { isAdmin } = require('../middleware/roleMiddleware');

const listVehicles = async (req, res, next) => {
  try {
    const where = req.query.available === 'true' ? { status: 'AVAILABLE' } : {};
    const vehicles = await Vehicle.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json({ success: true, data: vehicles });
  } catch (error) { return next(error); }
};

const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { legacyId: req.params.id } }) || await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    return res.json({ success: true, data: vehicle });
  } catch (error) { return next(error); }
};

const saveVehicle = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'Only an Admin can manage vehicles.' });
    const fields = ['make', 'model', 'variant', 'year', 'sellingPrice', 'purchaseRate', 'stock', 'status', 'fuel', 'transmission', 'mileage', 'engine', 'colors', 'images', 'description', 'supplierId'];
    const values = Object.fromEntries(fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
    const vehicle = req.params.id ? await Vehicle.findByPk(req.params.id) : Vehicle.build({ ...values, legacyId: `CAR-${Date.now()}` });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    Object.assign(vehicle, values);
    await vehicle.save();
    await AuditLog.create({ action: req.params.id ? 'VEHICLE_UPDATED' : 'VEHICLE_CREATED', entity: 'Vehicle', entityId: vehicle.id, actorId: req.user.userId, details: { status: vehicle.status } });
    return res.status(req.params.id ? 200 : 201).json({ success: true, data: vehicle });
  } catch (error) { return next(error); }
};

const deleteVehicle = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'Only an Admin can manage vehicles.' });
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    await vehicle.destroy();
    await AuditLog.create({ action: 'VEHICLE_DELETED', entity: 'Vehicle', entityId: vehicle.id, actorId: req.user.userId, details: {} });
    return res.json({ success: true, message: 'Vehicle deleted' });
  } catch (error) { return next(error); }
};

module.exports = { listVehicles, getVehicle, saveVehicle, deleteVehicle };
