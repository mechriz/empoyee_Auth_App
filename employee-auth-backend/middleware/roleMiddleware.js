// File: middleware/roleMiddleware.js

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure allowedRoles is always an array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    console.log('Checking role access for:', req.user.role, '| Allowed:', roles); // 🪵 DEBUG
   
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }

    next();
  };
};
