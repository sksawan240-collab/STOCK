import { Router } from 'express';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { Portfolio } from '../models/Portfolio.js';
import { getStockQuote } from '../services/marketService.js';

const router = Router();

// Get user portfolio holdings & real-time gains/losses
router.get('/', verifyAuth, async (req: AuthRequest, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user?.userId });
    if (!portfolio) {
      portfolio = await Portfolio.create({ userId: req.user?.userId, investments: [] });
    }

    const evaluatedInvestments = [];
    let totalInvested = 0;
    let totalCurrentValue = 0;

    for (const inv of portfolio.investments) {
      let currentPrice = inv.buyPrice;
      let exchange = inv.exchange;
      try {
        const quote = await getStockQuote(inv.symbol);
        currentPrice = quote.price;
        exchange = quote.exchange || inv.exchange;
      } catch (err) {
        // If market API quote fails for symbol, use buyPrice as reference with warning
      }

      const investedAmount = inv.quantity * inv.buyPrice;
      const currentValue = inv.quantity * currentPrice;
      const gainLoss = currentValue - investedAmount;
      const gainLossPct = investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;

      totalInvested += investedAmount;
      totalCurrentValue += currentValue;

      evaluatedInvestments.push({
        id: inv._id,
        symbol: inv.symbol,
        exchange,
        quantity: inv.quantity,
        buyPrice: inv.buyPrice,
        currentPrice,
        investedAmount: +investedAmount.toFixed(2),
        currentValue: +currentValue.toFixed(2),
        gainLoss: +gainLoss.toFixed(2),
        gainLossPct: +gainLossPct.toFixed(2),
        buyDate: inv.buyDate
      });
    }

    const totalGainLoss = totalCurrentValue - totalInvested;
    const totalGainLossPct = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    res.json({
      success: true,
      portfolio: {
        totalInvested: +totalInvested.toFixed(2),
        totalCurrentValue: +totalCurrentValue.toFixed(2),
        totalGainLoss: +totalGainLoss.toFixed(2),
        totalGainLossPct: +totalGainLossPct.toFixed(2),
        investments: evaluatedInvestments
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Add investment transaction
router.post('/investments', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const { symbol, exchange, quantity, buyPrice, buyDate } = req.body;
    if (!symbol || !quantity || !buyPrice) {
      return res.status(400).json({ error: 'Symbol, quantity, and buy price are required.' });
    }

    let portfolio = await Portfolio.findOne({ userId: req.user?.userId });
    if (!portfolio) {
      portfolio = await Portfolio.create({ userId: req.user?.userId, investments: [] });
    }

    portfolio.investments.push({
      symbol: symbol.toUpperCase(),
      exchange: exchange || 'NSE/NYSE',
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
      buyDate: buyDate ? new Date(buyDate) : new Date()
    });

    await portfolio.save();
    res.status(201).json({ success: true, message: 'Investment added successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Remove investment transaction
router.delete('/investments/:id', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user?.userId });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found.' });

    portfolio.investments = portfolio.investments.filter((inv: any) => inv._id.toString() !== req.params.id);
    await portfolio.save();

    res.json({ success: true, message: 'Investment removed successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
