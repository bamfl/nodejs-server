import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { router } from './router.js';

const PORT = process.env.PORT || 3000;
const mongoURI = 'mongodb+srv://test:test123456@cluster0.c5m04.mongodb.net/?retryWrites=true&w=majority';

const app = express();

app.use(express.json());
app.use(router);

const start = async () => {
  try {
    await mongoose.connect(mongoURI);
    app.listen(PORT, () => console.log('Server started on port ' + PORT));
  } catch (e) {
    console.error(e);
  }
};

start();
