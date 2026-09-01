const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  teamLeadId: user.teamLeadId,
  avatar: user.avatar,
  cnic: user.cnic,
  role: user.role,
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
    const { name, email, password, teamLeadId, avatar, cnic, role } = req.body;

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
      role: role || 'user',
    });

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
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    return res.json({ success: true, message: 'Users fetched', data: users.map(sanitizeUser), errors: [] });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, teamLeadId, cnic, avatar, role } = req.body;
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
    });

    return res.status(201).json({ success: true, message: 'User created', data: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id, name, email, teamLeadId, cnic, avatar, role } = req.body;
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

    await user.save();
    return res.json({ success: true, message: 'User updated', data: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.destroy();
    return res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return next(error);
  }
};

const getUsersByTeamLead = async (req, res, next) => {
  try {
    const { teamLeadId } = req.params;
    const users = await User.findAll({
      where: { teamLeadId: Number(teamLeadId) },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, message: 'Team users fetched', data: users.map(sanitizeUser) });
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
