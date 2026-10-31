import React, { useState } from 'react';
import api from '../services/api';
import { AnalysisRecord } from '../types';
import { UploadCloud, Image as ImageIcon, Sparkles, TrendingUp, ShieldAlert, FileText, CheckCircle2, AlertCircle, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChartAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('1D');
  const [contextNote, setContextNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);
  const [error, setError] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a chart image file.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('chartImage', file);
    formData.append('symbol', symbol);
    formData.append('timeframe', timeframe);
    formData.append('contextNote', contextNote);

    try {
      const res = await api.post('/analysis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze chart image.');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!analysis) return;
    setGeneratingPdf(true);
    try {
      const res = await api.post(`/reports/generate/${analysis._id}`);
      alert('PDF Report generated successfully and dispatched to your email! You can also download it from My Reports.');
      navigate('/reports');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4 shadow-[0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> AI Vision OCR & Candlestick Pattern Recognition
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            AI Stock Chart Analyzer
          </h1>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Upload a stock chart screenshot to extract technical indicators, support/resistance levels, and conditional price scenarios.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Form Card */}
        <div className="max-w-3xl mx-auto bg-[#0c081e] border border-violet-900/40 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Upload Chart Screenshot (PNG, JPG, WEBP)
              </label>
              <div className="border-2 border-dashed border-violet-900/60 hover:border-amber-400/50 rounded-2xl p-8 text-center cursor-pointer transition-colors relative bg-[#070514]/60">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="Chart preview" className="max-h-56 mx-auto rounded-xl object-contain shadow-2xl border border-violet-950" />
                    <span className="text-xs text-amber-400 font-bold">{file?.name} (Click to change)</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <UploadCloud className="w-12 h-12 text-amber-400 mx-auto" />
                    <div className="text-sm font-bold text-slate-200">Drag and drop your chart image here, or browse</div>
                    <div className="text-xs text-slate-500">Supports PNG, JPG, JPEG up to 10MB</div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Stock Symbol (Optional)</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. NIFTY50, AAPL"
                  className="w-full px-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                >
                  <option value="1D">1 Day (1D)</option>
                  <option value="1W">1 Week (1W)</option>
                  <option value="1H">1 Hour (1H)</option>
                  <option value="15M">15 Minutes (15M)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Additional Context / Question (Optional)</label>
              <textarea
                value={contextNote}
                onChange={(e) => setContextNote(e.target.value)}
                placeholder="Mention key indicators visible or specific questions (e.g. breakout evaluation)..."
                rows={3}
                className="w-full px-4 py-3.5 bg-[#070514] border border-violet-900/60 rounded-2xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400 resize-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black shadow-xl shadow-violet-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>AI Vision Analyzing Chart...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Run AI Chart Analysis
                </>
              )}
            </button>
          </form>
        </div>

        {/* Analysis Results Section */}
        {analysis && (
          <div className="max-w-5xl mx-auto bg-[#0c081e] border border-violet-900/50 rounded-3xl p-8 sm:p-12 backdrop-blur-2xl shadow-2xl space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-violet-950 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-white">{analysis.stockSymbol} Analysis Results</h2>
                  <span className="text-xs px-3.5 py-1.5 rounded-xl bg-violet-950 text-amber-300 border border-violet-800 font-bold">
                    {analysis.exchange} • {analysis.timeframe}
                  </span>
                </div>
                <div className="text-sm text-slate-400 mt-1">Reference Price: ₹{analysis.referencePrice} | Method: {analysis.methodology}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/assistant', { state: { analysisId: analysis._id } })}
                  className="px-4 py-3 rounded-2xl bg-violet-950 hover:bg-violet-900 text-amber-400 font-bold text-sm flex items-center gap-2 border border-violet-800 transition-colors shadow-lg"
                >
                  <Bot className="w-4 h-4" /> Ask AI Assistant
                </button>
                <button
                  onClick={generateReport}
                  disabled={generatingPdf}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-violet-500/20 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" /> {generatingPdf ? 'Generating PDF...' : 'Download & Email Report'}
                </button>
              </div>
            </div>

            {/* Indicators Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">RSI (14)</div>
                <div className="text-2xl font-black text-white mt-1">{analysis.technicalIndicators?.rsi}</div>
              </div>
              <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">MACD Signal</div>
                <div className="text-sm font-black text-white mt-1 truncate">{analysis.technicalIndicators?.macd}</div>
              </div>
              <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">50 SMA</div>
                <div className="text-xl font-black text-white mt-1">₹{analysis.technicalIndicators?.sma50}</div>
              </div>
              <div className="bg-[#070514]/80 border border-violet-900/40 p-5 rounded-2xl shadow-md">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">200 SMA</div>
                <div className="text-xl font-black text-white mt-1">₹{analysis.technicalIndicators?.sma200}</div>
              </div>
            </div>

            {/* Support & Resistance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#070514]/80 border border-emerald-500/30 rounded-2xl p-6 shadow-md">
                <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-3">Support Levels</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.supportLevels?.map((lvl, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-black text-sm">
                      ₹{lvl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#070514]/80 border border-rose-500/30 rounded-2xl p-6 shadow-md">
                <h3 className="text-rose-400 font-bold text-sm uppercase tracking-wider mb-3">Resistance Levels</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.resistanceLevels?.map((lvl, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono font-black text-sm">
                      ₹{lvl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Forecast Scenarios */}
            <div className="bg-[#070514]/80 border border-violet-900/40 rounded-3xl p-6 space-y-4 shadow-md">
              <h3 className="text-white font-black text-lg">Conditional Price Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-400 uppercase">Bullish Target</div>
                  <div className="text-2xl font-black text-white mt-1">₹{analysis.forecastScenarios?.bullish?.target}</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{analysis.forecastScenarios?.bullish?.description}</p>
                </div>

                <div className="p-5 rounded-2xl bg-violet-950/20 border border-violet-900/40">
                  <div className="text-xs font-bold text-amber-400 uppercase">Neutral Scenario</div>
                  <div className="text-2xl font-black text-white mt-1">₹{analysis.forecastScenarios?.neutral?.target}</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{analysis.forecastScenarios?.neutral?.description}</p>
                </div>

                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                  <div className="text-xs font-bold text-rose-400 uppercase">Bearish Target</div>
                  <div className="text-2xl font-black text-white mt-1">₹{analysis.forecastScenarios?.bearish?.target}</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{analysis.forecastScenarios?.bearish?.description}</p>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-[#070514]/80 border border-violet-900/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div>
                <h3 className="text-white font-black text-lg">Risk Assessment & Stop-Loss Reference</h3>
                <p className="text-xs text-slate-400 mt-1">Suggested stop-loss level and risk-to-reward metrics.</p>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold">Stop Loss</div>
                  <div className="text-xl font-black text-rose-400">₹{analysis.riskAssessment?.stopLoss}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold">Risk : Reward</div>
                  <div className="text-xl font-black text-amber-400">{analysis.riskAssessment?.riskRewardRatio}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
