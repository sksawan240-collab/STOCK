import { Router } from 'express';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { Watchlist } from '../models/Watchlist.js';

const router = Router();

// Get watchlist
router.get('/', verifyAuth, async (req: AuthRequest, res) => {
  try {
    let watchlist = await Watchlist.findOne({ userId: req.user?.userId });
    if (!watchlist) {
      watchlist = await Watchlist.create({ userId: req.user?.userId, stocks: [] });
    }
    res.json({ success: true, watchlist });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Add stock to watchlist
router.post('/', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const { symbol, exchange } = req.body;
    if (!symbol) return res.status(400).json({ error: 'Stock symbol is required.' });

    let watchlist = await Watchlist.findOne({ userId: req.user?.userId });
    if (!watchlist) {
      watchlist = await Watchlist.create({ userId: req.user?.userId, stocks: [] });
    }

    const cleanSymbol = symbol.toUpperCase();
    const exists = watchlist.stocks.some((s: any) => s.symbol === cleanSymbol);
    if (!exists) {
      watchlist.stocks.push({ symbol: cleanSymbol, exchange: exchange || 'NSE/NYSE', addedAt: new Date() });
      await watchlist.save();
    }

    res.json({ success: true, watchlist });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Remove stock from watchlist
router.delete('/:symbol', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const cleanSymbol = req.params.symbol.toUpperCase();
    const watchlist = await Watchlist.findOne({ userId: req.user?.userId });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found.' });

    watchlist.stocks = watchlist.stocks.filter((s: any) => s.symbol !== cleanSymbol);
    await watchlist.save();

    res.json({ success: true, watchlist });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
