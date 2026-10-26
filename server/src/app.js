import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ data: { status: 'ok' } });
});

export default app;