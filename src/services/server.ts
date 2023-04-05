import { app } from './app';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE!;

try {
  mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions).then((con) => {
    console.log('DB connection successful');
  });

  const port = process.env.PORT || 3000;

  const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
} catch (error: any) {
  console.log(error);
}
