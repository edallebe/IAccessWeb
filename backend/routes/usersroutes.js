const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userscontrollers');

// GET - Get all users
router.get('/user', usersController.getAll);

// GET - Get user by ID
router.get('/user/:id', usersController.getById);

// POST - Register a new user
router.post('/user', usersController.register);

// POST - Login user
router.post('/user/login', usersController.login);

// PUT - Update user
router.put('/user/:id', usersController.update);

// DELETE - Delete user
router.delete('/user/:id', usersController.delete);

module.exports = router;