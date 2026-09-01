const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByTeamLead,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/teamUsers/:teamLeadId', authMiddleware, getUsersByTeamLead);
router.post('/user', authMiddleware, createUser);
router.get('/user', authMiddleware, getAllUsers);
router.get('/user/:id', authMiddleware, getUserById);
router.put('/user', authMiddleware, updateUser);
router.delete('/user/:id', authMiddleware, deleteUser);

module.exports = router;
