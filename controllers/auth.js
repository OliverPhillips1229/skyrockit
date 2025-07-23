const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

// GET /auth/sign-up
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

// POST /auth/sign-up
router.post("/sign-up", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.send("Password and Confirm Password must match");
  }
  const userInDatabase = await User.findOne({ username });
  if (userInDatabase) {
    return res.send("Username already taken.");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  req.session.user = { username: user.username, _id: user._id };
  res.redirect("/");
});

// GET /auth/sign-in
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

// POST /auth/sign-in
router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;
  const userInDatabase = await User.findOne({ username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }
  const validPassword = bcrypt.compareSync(password, userInDatabase.password);
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }
  req.session.user = { username: userInDatabase.username, _id: userInDatabase._id };
  res.redirect("/");
});

// GET /auth/sign-out
router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
