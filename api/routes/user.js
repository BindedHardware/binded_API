const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');
const User = require('../models/user');
const controllerUser = require('../controllers/user');

router.post('/signup', controllerUser.signUp);
router.post('/login',controllerUser.logIn);
router.delete("/:userId", checkAuth, controllerUser.deleteId);

module.exports = router;
