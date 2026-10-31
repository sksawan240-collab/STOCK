import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-950/80 border-b border-amber-600/40 text-amber-200 px-4 py-2 text-xs md:text-sm flex items-center justify-center gap-2 backdrop-blur-md">
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        <strong>Educational Purpose Notice:</strong> AI StockVision is for learning and research. Outputs are not guaranteed and do not constitute personalized financial advice or SEBI-certified investment recommendations.
      </span>
    </div>
  );
}
