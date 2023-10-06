const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const { signup, login } = require('../controller/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('Email address already exists');
          }
        });
      })
      .normalizeEmail(),
    body('name').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 6 }),
  ],
  signup
);

router.post('/login', login);

module.exports = router;
