import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import userRouter from './api/routes/userRoutes';
import carRouter from './api/routes/carRoutes';
import reservationRouter from './api/routes/reservationRoutes';

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1', userRouter);
app.use('/api/v1', carRouter);
app.use('/api/v1', reservationRouter);
//app.use('/api/v1');

app.use(json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});
export default app;
