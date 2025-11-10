import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ name: 'sales-pad-api', status: 'online' });
});

app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

export default app;
