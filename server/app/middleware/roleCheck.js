export function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { roles } = req.user;

    if (roles.includes(requiredRole)) {
      next();
    } else {
      res.status(403).json({ message: `Requires ${requiredRole} role` });
    }
  };
}
