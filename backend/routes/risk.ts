import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.post('/calculate', verifyAuth, (req, res) => {
  try {
    const { entryPrice, stopLossPrice, targetPrice, capital, riskPct } = req.body;
    
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLossPrice);
    const target = parseFloat(targetPrice);
    const cap = parseFloat(capital);
    const risk = parseFloat(riskPct);

    if (isNaN(entry) || isNaN(sl) || isNaN(target) || isNaN(cap) || isNaN(risk)) {
      return res.status(400).json({ error: 'All calculation parameters must be valid numbers.' });
    }

    if (entry <= 0 || sl <= 0 || target <= 0 || cap <= 0 || risk <= 0) {
      return res.status(400).json({ error: 'Values must be greater than zero.' });
    }

    const perUnitRisk = Math.abs(entry - sl);
    if (perUnitRisk === 0) {
      return res.status(400).json({ error: 'Entry price cannot equal stop-loss price.' });
    }

    const allowedCapitalAtRisk = cap * (risk / 100);
    const quantity = Math.floor(allowedCapitalAtRisk / perUnitRisk);
    const totalExposure = quantity * entry;
    const potentialProfit = quantity * Math.abs(target - entry);
    const potentialLoss = quantity * perUnitRisk;
    const riskRewardRatio = +(potentialProfit / potentialLoss).toFixed(2);

    res.json({
      success: true,
      calculation: {
        entryPrice: entry,
        stopLossPrice: sl,
        targetPrice: target,
        capital: cap,
        riskPct: risk,
        perUnitRisk,
        allowedCapitalAtRisk: +allowedCapitalAtRisk.toFixed(2),
        recommendedQuantity: quantity,
        totalExposure: +totalExposure.toFixed(2),
        potentialProfit: +potentialProfit.toFixed(2),
        potentialLoss: +potentialLoss.toFixed(2),
        riskRewardRatio: `1 : ${riskRewardRatio}`,
        warnings: [
          'Educational risk calculation. Actual execution slippage and brokerage may vary.',
          'Stop-loss orders do not guarantee execution at exact stop prices during gap downs.'
        ]
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
