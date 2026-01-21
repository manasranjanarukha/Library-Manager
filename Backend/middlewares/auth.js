function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Attach user to request
  req.user = req.session.user;

  next();
}

module.exports = isAuthenticated;
