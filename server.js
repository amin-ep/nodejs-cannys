import mongoose from 'mongoose';
import app from './app.js';
import { config } from 'dotenv';

config({ path: '.env' });

const DB = process.env.DB_URL;
const port = process.env.PORT || 3000;

mongoose.connect(DB).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
  console.log(`mode: ${process.env.NODE_ENV}`);
});
