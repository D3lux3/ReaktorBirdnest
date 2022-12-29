import express from 'express';
import { PORT } from './util/config';
import { connectToDatabase } from './util/database';
import droneRouter from './routers/droneRouter';
import cron from 'cron';
import { deleteExpiredDronesFromDatabase } from './services/droneService';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

app.use('/drone', droneRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();

const deleteExpiredDronesCronJob = new cron.CronJob('*/5 * * * *',
  async () => {
    console.log('Cron job running at: ', new Date().toISOString());
    await deleteExpiredDronesFromDatabase();
    console.log('Cron job finished at: ', new Date().toISOString());
  });

deleteExpiredDronesCronJob.start();