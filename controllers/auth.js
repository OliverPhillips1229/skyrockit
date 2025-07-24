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
  try {
    const { username, password, confirmPassword } = req.body;
    
    // Validation
    if (!username || !password || !confirmPassword) {
      return res.status(400).send("All fields are required.");
    }
    
    if (password !== confirmPassword) {
      return res.status(400).send("Password and Confirm Password must match");
    }
    
    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long.");
    }
    
    const userInDatabase = await User.findOne({ username });
    if (userInDatabase) {
      return res.status(400).send("Username already taken.");
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    req.session.user = { username: user.username, _id: user._id };
    res.redirect("/");
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).send("An error occurred during sign-up. Please try again.");
  }
});

// GET /auth/sign-in
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

// POST /auth/sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }
    
    const userInDatabase = await User.findOne({ username });
    if (!userInDatabase) {
      return res.status(400).send("Login failed. Please try again.");
    }
    
    const validPassword = bcrypt.compareSync(password, userInDatabase.password);
    if (!validPassword) {
      return res.status(400).send("Login failed. Please try again.");
    }
    
    req.session.user = { username: userInDatabase.username, _id: userInDatabase._id };
    res.redirect("/");
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).send("An error occurred during sign-in. Please try again.");
  }
});

// GET /auth/sign-out
router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
