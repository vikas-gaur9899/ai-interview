export const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
