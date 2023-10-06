import express from 'express';
import { body } from 'express-validator';
import User from '../models/user.js';
import {
  signup,
  login,
  getUserStatus,
  updateUserStatus,
} from '../controller/auth.js';
import isAuth from '../middleware/isAuth.js';

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

router.get('/status', isAuth, getUserStatus);

router.patch(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  updateUserStatus
);

export default router;
