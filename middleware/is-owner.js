const isOwner = (req, res, next) => {
  if (req.session.user._id === req.params.userId) {
    return next();
  }
  res.status(403).send("You are not authorized to view this page.");
};

module.exports = isOwner;
