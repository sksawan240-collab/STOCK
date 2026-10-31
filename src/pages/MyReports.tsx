import { useState, useEffect } from 'react';
import api from '../services/api';
import { ReportRecord } from '../types';
import { FileText, Download, Trash2, Calendar, ShieldCheck } from 'lucide-react';

export default function MyReports() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports');
      setReports(res.data.reports);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter(r => r._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const downloadPdf = async (id: string, reportId: string) => {
    try {
      const response = await api.get(`/reports/${id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AI-StockVision-Report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert('Failed to download PDF report.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0c081e] border border-violet-900/40 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <FileText className="w-3.5 h-3.5" /> Institutional Reports
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              My Saved Analysis Reports
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Access and download your previously generated professional PDF reports containing complete analysis and mandatory SEBI disclaimers.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading saved reports...</div>
        ) : reports.length === 0 ? (
          <div className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-16 text-center space-y-5 shadow-2xl">
            <FileText className="w-14 h-14 text-amber-400/60 mx-auto" />
            <h3 className="text-xl font-black text-white">No saved reports found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Analyze a stock chart using the Chart Analyzer and click "Download PDF Report" to generate saved educational reports.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((rep) => {
              const analysis = rep.analysisId;
              return (
                <div key={rep._id} className="bg-[#0c081e] border border-violet-900/40 rounded-3xl p-7 backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-black text-white text-xl">{analysis?.stockSymbol || 'STOCK'}</span>
                      <span className="text-xs px-3 py-1 rounded-xl bg-violet-950 text-amber-300 font-mono border border-violet-800">
                        {analysis?.exchange || 'NSE/NYSE'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-400">
                      <div>Report ID: <span className="font-mono text-slate-200">{rep.reportId}</span></div>
                      <div>Timeframe: <span className="text-slate-200">{analysis?.timeframe || '1D'}</span></div>
                      <div>Reference Price: <span className="text-slate-200">₹{analysis?.referencePrice}</span></div>
                      <div className="flex items-center gap-1.5 pt-2 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" /> {new Date(rep.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-violet-950 flex items-center justify-between">
                    <button
                      onClick={() => downloadPdf(rep._id, rep.reportId)}
                      className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-violet-600 to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg hover:opacity-95"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button
                      onClick={() => handleDelete(rep._id)}
                      className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
