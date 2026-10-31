import { useState, useEffect } from 'react';
import api from '../services/api';
import { Newspaper, Sparkles, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function MarketSentimentCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSentiment = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sentiment');
      setData(res.data.sentiment);
    } catch (err: any) {
      setError(err.message || 'Failed to load market sentiment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment();
  }, []);

  return (
    <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-violet-950 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Gemini AI News Sentiment
          </div>
          <h2 className="text-xl font-black text-white">Nifty 50 Market Sentiment Analysis</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time financial headlines analyzed by AI to score overall market health</p>
        </div>

        {data && (
          <div className="flex items-center gap-4 bg-[#070514] border border-violet-900/60 px-5 py-3 rounded-2xl shadow-inner">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Sentiment Score</div>
              <div className="text-2xl font-black text-amber-400">{data.overallScore} / 100</div>
            </div>
            <div className="h-8 w-px bg-violet-900/60" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Market Health</div>
              <div className="text-sm font-black text-emerald-400">{data.sentimentLabel}</div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-500 text-xs">Analyzing recent financial headlines with Gemini AI...</div>
      ) : data ? (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-900/30 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400">AI Market Summary:</strong> {data.summary}
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Financial Headlines</h3>
            <div className="space-y-3">
              {data.headlines?.map((h: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#070514]/80 border border-violet-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-amber-400/50 transition-colors">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white leading-snug">{h.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Source: {h.source}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-center ${
                    h.sentiment === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    h.sentiment === 'Bearish' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {h.sentiment}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
