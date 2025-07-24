// controllers/applications.js

const express = require('express');
const router = express.Router({ mergeParams: true });

const User = require('../models/user.js');

// GET /users/:userId/applications - Show all applications
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('applications/index.ejs', {
      applications: user.applications
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// GET /users/:userId/applications/new - Show form to create new application
router.get('/new', async (req, res) => {
  res.render('applications/new.ejs');
});

// POST /users/:userId/applications - Create new application
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.applications.push(req.body);
    await user.save();
    res.redirect(`/users/${req.params.userId}/applications`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.params.userId}/applications/new`);
  }
});

// GET /users/:userId/applications/:applicationId - Show single application
router.get('/:applicationId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const application = user.applications.id(req.params.applicationId);
    res.render('applications/show.ejs', {
      application: application
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.params.userId}/applications`);
  }
});

// GET /users/:userId/applications/:applicationId/edit - Show edit form
router.get('/:applicationId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const application = user.applications.id(req.params.applicationId);
    res.render('applications/edit.ejs', {
      application: application
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.params.userId}/applications`);
  }
});

// PUT /users/:userId/applications/:applicationId - Update application
router.put('/:applicationId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const application = user.applications.id(req.params.applicationId);
    application.set(req.body);
    await user.save();
    res.redirect(`/users/${req.params.userId}/applications/${req.params.applicationId}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.params.userId}/applications/${req.params.applicationId}/edit`);
  }
});

// DELETE /users/:userId/applications/:applicationId - Delete application
router.delete('/:applicationId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.applications.id(req.params.applicationId).deleteOne();
    await user.save();
    res.redirect(`/users/${req.params.userId}/applications`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.params.userId}/applications`);
  }
});

module.exports = router;

