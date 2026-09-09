const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const { AuditLog } = require('../models');
const { isAdmin, isManager } = require('../middleware/roleMiddleware');

const sanitizeUser = (user, viewer) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  teamLeadId: user.teamLeadId,
  avatar: user.avatar,
  cnic: viewer && (isAdmin(viewer.role) || viewer.userId === user.id) ? user.cnic : undefined,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createToken = (user) => jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'dev_secret',
  { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
);

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, teamLeadId, avatar, cnic, role, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      teamLeadId,
      avatar,
      cnic,
      role: 'Customer',
      status: status || 'Active',
    });
    await AuditLog.create({ action: 'USER_REGISTERED', entity: 'User', entityId: user.id, actorId: user.id, details: { role: user.role } });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const logoutUser = async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};

const getAllUsers = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'Only an Admin can view all users.' });
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    return res.json({ success: true, message: 'Users fetched', data: users.map(user => sanitizeUser(user, req.user)), errors: [] });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role) && Number(req.params.id) !== Number(req.user.userId)) return res.status(403).json({ success: false, message: 'You can only view your own user record.' });
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: sanitizeUser(user, req.user) });
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'Only an Admin can create users.' });
    const { name, email, password, teamLeadId, cnic, avatar, role, status } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      teamLeadId,
      cnic,
      avatar,
      role: role || 'user',
      status: status || 'Active',
    });
    await AuditLog.create({ action: 'USER_CREATED', entity: 'User', entityId: user.id, actorId: req.user.userId, details: { role: user.role } });

    return res.status(201).json({ success: true, message: 'User created', data: sanitizeUser(user, req.user) });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'Only an Admin can update users.' });
    const { id, name, email, teamLeadId, cnic, avatar, role, status } = req.body;
    const user = await User.findByPk(id || req.user?.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (teamLeadId !== undefined) user.teamLeadId = teamLeadId;
    if (cnic !== undefined) user.cnic = cnic;
    if (avatar !== undefined) user.avatar = avatar;
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();
    await AuditLog.create({ action: 'USER_UPDATED', entity: 'User', entityId: user.id, actorId: req.user.userId, details: { role: user.role, status: user.status } });
    return res.json({ success: true, message: 'User updated', data: sanitizeUser(user, req.user) });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role)) return res.status(403).json({ success: false, message: 'Only an Admin can delete users.' });
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.destroy();
    await AuditLog.create({ action: 'USER_DELETED', entity: 'User', entityId: user.id, actorId: req.user.userId, details: {} });
    return res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return next(error);
  }
};

const getUsersByTeamLead = async (req, res, next) => {
  try {
    if (!isAdmin(req.user.role) && (!isManager(req.user.role) || Number(req.params.teamLeadId) !== Number(req.user.userId))) return res.status(403).json({ success: false, message: 'You are not authorized to view this team.' });
    const { teamLeadId } = req.params;
    const users = await User.findAll({
      where: { teamLeadId: Number(teamLeadId) },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, message: 'Team users fetched', data: users.map(user => sanitizeUser(user, req.user)) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByTeamLead,
  sanitizeUser,
};
