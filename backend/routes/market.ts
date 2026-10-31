import { Router } from 'express';
import { getStockQuote, getStockHistory, searchStocks } from '../services/marketService.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/quote/:symbol', verifyAuth, async (req, res) => {
  try {
    const quote = await getStockQuote(req.params.symbol);
    res.json({ success: true, quote });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history/:symbol', verifyAuth, async (req, res) => {
  try {
    const timeframe = (req.query.timeframe as string) || '1D';
    const history = await getStockHistory(req.params.symbol, timeframe);
    res.json({ success: true, history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', verifyAuth, async (req, res) => {
  try {
    const q = (req.query.q as string) || '';
    const results = await searchStocks(q);
    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
