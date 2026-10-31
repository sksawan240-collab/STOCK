import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './backend/config/db.js';

import authRoutes from './backend/routes/auth.js';
import analysisRoutes from './backend/routes/analysis.js';
import marketRoutes from './backend/routes/market.js';
import chatRoutes from './backend/routes/chat.js';
import riskRoutes from './backend/routes/risk.js';
import reportRoutes from './backend/routes/reports.js';
import watchlistRoutes from './backend/routes/watchlist.js';
import portfolioRoutes from './backend/routes/portfolio.js';
import sentimentRoutes from './backend/routes/sentiment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Connect database
  await connectDB();

  // Middleware
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/analysis', analysisRoutes);
  app.use('/api/market', marketRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/risk', riskRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/watchlist', watchlistRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/sentiment', sentimentRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite development middleware or static production serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`AI StockVision server running on port ${PORT} (Prod: ${isProd})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});