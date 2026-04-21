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

/** Deployed SPA on Railway — always allowed alongside env-based origins. */
const PUBLIC_FRONTEND_ORIGIN = 'https://frontend-production-ca54.up.railway.app';

function buildCorsOrigins(): string[] {
  const origins = new Set<string>(['http://localhost:5173', PUBLIC_FRONTEND_ORIGIN]);

  const single = process.env.FRONTEND_URL?.trim();
  if (single) origins.add(single);

  if (process.env.FRONTEND_URLS) {
    process.env.FRONTEND_URLS.split(',').forEach(s => {
      const t = s.trim();
      if (t) origins.add(t);
    });
  }

  return [...origins];
}

const corsOrigins = buildCorsOrigins();

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
