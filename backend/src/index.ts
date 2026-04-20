import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import workflowRoutes from './routes/workflow.routes';
import automationRoutes from './routes/automation.routes';
import simulateRoutes from './routes/simulate.routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.set('trust proxy', 1);

const corsOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(s => s.trim()).filter(Boolean)
  : [process.env.FRONTEND_URL || 'http://localhost:5173'];

app.use(helmet());
app.use(cors({ origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'hr-workflow-api' });
});

app.use('/api/workflows', workflowRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/simulate', simulateRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
