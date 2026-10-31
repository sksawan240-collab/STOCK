import { Router } from 'express';
import multer from 'multer';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { Analysis } from '../models/Analysis.js';
import { analyzeChartWithAI } from '../services/aiService.js';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, JPEG, WEBP) are allowed.'));
    }
  }
});

const router = Router();

// Upload chart image & run AI analysis
router.post('/upload', verifyAuth, upload.single('chartImage'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No chart image file uploaded.' });
    }

    const { symbol, timeframe, contextNote } = req.body;
    const cleanSymbol = (symbol || 'UNKNOWN').toUpperCase();
    const cleanTimeframe = timeframe || '1D';

    // Call AI vision service
    const analysisResult = await analyzeChartWithAI(
      req.file.buffer,
      req.file.mimetype,
      cleanSymbol,
      cleanTimeframe,
      contextNote
    );

    // Save to database
    const savedAnalysis = await Analysis.create({
      userId: req.user?.userId,
      stockSymbol: analysisResult.stockSymbol || cleanSymbol,
      exchange: analysisResult.exchange || 'NSE/NYSE',
      timeframe: analysisResult.timeframe || cleanTimeframe,
      sourceType: 'upload',
      imageUrl: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      referencePrice: analysisResult.referencePrice || 100.0,
      technicalIndicators: analysisResult.technicalIndicators || {},
      supportLevels: analysisResult.supportLevels || [],
      resistanceLevels: analysisResult.resistanceLevels || [],
      forecastScenarios: analysisResult.forecastScenarios || {},
      riskAssessment: analysisResult.riskAssessment || {},
      methodology: analysisResult.methodology || 'AI Vision Pattern Recognition',
      dataSource: analysisResult.dataSource || 'Uploaded Image & Technical Calculation',
      warnings: analysisResult.warnings || ['Educational purposes only.']
    });

    res.status(201).json({
      success: true,
      message: 'Chart analysis completed successfully.',
      analysis: savedAnalysis
    });
  } catch (err: any) {
    console.error('Chart analysis upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze chart image.' });
  }
});

// Get all analyses for current user
router.get('/', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const list = await Analysis.find({ userId: req.user?.userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, analyses: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single analysis by ID
router.get('/:id', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user?.userId });
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis record not found or unauthorized.' });
    }
    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete analysis
router.delete('/:id', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const deleted = await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!deleted) {
      return res.status(404).json({ error: 'Analysis not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Analysis deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
