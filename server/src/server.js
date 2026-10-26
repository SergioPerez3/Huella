import 'dotenv/config';
import dns from 'node:dns';
import app from './app.js';
import connectDB from './config/db.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});