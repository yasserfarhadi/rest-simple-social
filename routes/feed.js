import express from 'express';
import { body } from 'express-validator';
import isAuth from '../middleware/isAuth.js';

import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from '../controller/feed.js';

const router = express.Router();

router.get('/posts', isAuth, getPosts);

router.post(
  '/post',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get('/post/:postId', isAuth, getPost);

router.put(
  '/post/:postId',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete('/post/:postId', isAuth, deletePost);

export default router;
