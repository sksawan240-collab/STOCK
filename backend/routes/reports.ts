import { Router } from 'express';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { Analysis } from '../models/Analysis.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { generatePdfReportBuffer } from '../services/pdfService.js';
import { sendReportEmail } from '../services/emailService.js';

const router = Router();

// Generate PDF report for an analysis & send to user email
router.post('/generate/:analysisId', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.analysisId, userId: req.user?.userId });
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis record not found or unauthorized.' });
    }

    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const reportId = 'SV-RPT-' + Math.floor(100000 + Math.random() * 900000);
    const report = await Report.create({
      reportId,
      userId: req.user?.userId,
      analysisId: analysis._id,
      reportFormat: 'PDF',
      methodologyVersion: 'v2.5-ai-vision'
    });

    // Send PDF report to user's registered email address
    await sendReportEmail(user.email, user.name, analysis.stockSymbol, reportId);

    res.status(201).json({
      success: true,
      message: `PDF report generated successfully and dispatched to ${user.email}.`,
      report
    });
  } catch (err: any) {
    console.error('Report generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate report.' });
  }
});

// List user reports
router.get('/', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const reports = await Report.find({ userId: req.user?.userId })
      .populate('analysisId')
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Download PDF report
router.get('/:id/download', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user?.userId }).populate('analysisId');
    if (!report) {
      return res.status(404).json({ error: 'Report not found or unauthorized.' });
    }

    const analysis = report.analysisId;
    if (!analysis) {
      return res.status(404).json({ error: 'Associated analysis record missing.' });
    }

    const user = await User.findById(req.user?.userId);
    const pdfBuffer = await generatePdfReportBuffer(analysis, user || { name: 'User', email: 'user@example.com' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="AI-StockVision-Report-${report.reportId}.pdf"`);
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error('PDF download error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate PDF document.' });
  }
});

// Delete report
router.delete('/:id', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const deleted = await Report.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!deleted) return res.status(404).json({ error: 'Report not found or unauthorized.' });
    res.json({ success: true, message: 'Report deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
