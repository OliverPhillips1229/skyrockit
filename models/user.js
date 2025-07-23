const mongoose = require("mongoose");

// models/user.js

const applicationSchema = new mongoose.Schema({
  // properties of applications
  company: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  postingLink: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      'interested',
      'applied', 
      'interviewing', 
      'rejected', 
      'accepted'],
      required: true,
  },
});


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,      // Ensure usernames are unique
    trim: true,        // Remove whitespace
  },
  password: {
    type: String,
    required: true,
  },
  applications: [applicationSchema], // Array of applications
});


const User = mongoose.model("User", userSchema);

module.exports = User;
