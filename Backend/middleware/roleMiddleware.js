const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You are not authorized to perform this action.' });
  }
  next();
};

const isManager = (role) => ['MANAGER', 'Manager', 'Sales Manager'].includes(role);
const isAdmin = (role) => ['SUPER_ADMIN', 'SUPER ADMIN', 'Admin'].includes(role);
const isSuperAdmin = (role) => ['SUPER_ADMIN', 'SUPER ADMIN', 'Admin'].includes(role);

module.exports = { roleMiddleware, isManager, isAdmin, isSuperAdmin };
