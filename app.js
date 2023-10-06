import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'node:path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import { init } from './socket.js';

import feedRouter from './routes/feed.js';
import authRouter from './routes/auth.js';

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-url-encoded <form>إ

app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use('/images', express.static(path.join(process.cwd(), '/images')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRouter);
app.use('/auth', authRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode = 500, message, data } = error;
  res.status(statusCode).json({
    message,
    data,
  });
});

try {
  await mongoose.connect('mongodb://127.0.0.1:27017/social');
  console.log('Connected to mongodb');
  const server = app.listen(8080);
  console.log('Server started at port 8080');
  const io = init(server);

  io.on('connection', (socket) => {
    console.log('Client Connected', socket.id);
  });
} catch (err) {
  console.log(err);
}
