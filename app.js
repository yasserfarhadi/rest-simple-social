const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('node:path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');

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

mongoose
  .connect('mongodb://127.0.0.1:27017/social')
  .then((result) => {
    console.log('Connected to mongodb');
    app.listen(8080);
    console.log('Server started at port 8080');
  })
  .catch(console.log);
