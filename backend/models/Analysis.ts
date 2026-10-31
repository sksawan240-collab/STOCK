import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  stockSymbol: string;
  exchange: string;
  timeframe: string;
  sourceType: 'upload' | 'symbol';
  imageUrl?: string;
  referencePrice: number;
  technicalIndicators: {
    rsi: number;
    macd: string;
    sma50: number;
    sma200: number;
    bollingerBands: string;
  };
  supportLevels: number[];
  resistanceLevels: number[];
  forecastScenarios: {
    bullish: { target: number; description: string };
    bearish: { target: number; description: string };
    neutral: { target: number; description: string };
  };
  riskAssessment: {
    stopLoss: number;
    riskRewardRatio: string;
    volatility: string;
    maxRecommendedRiskPct: number;
  };
  methodology: string;
  dataSource: string;
  dataTimestamp: Date;
  warnings: string[];
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stockSymbol: { type: String, required: true, uppercase: true },
  exchange: { type: String, default: 'NSE/NYSE' },
  timeframe: { type: String, default: '1D' },
  sourceType: { type: String, enum: ['upload', 'symbol'], default: 'upload' },
  imageUrl: { type: String },
  referencePrice: { type: Number, required: true },
  technicalIndicators: {
    rsi: { type: Number },
    macd: { type: String },
    sma50: { type: Number },
    sma200: { type: Number },
    bollingerBands: { type: String },
  },
  supportLevels: [Number],
  resistanceLevels: [Number],
  forecastScenarios: {
    bullish: { target: Number, description: String },
    bearish: { target: Number, description: String },
    neutral: { target: Number, description: String },
  },
  riskAssessment: {
    stopLoss: Number,
    riskRewardRatio: String,
    volatility: String,
    maxRecommendedRiskPct: Number,
  },
  methodology: { type: String },
  dataSource: { type: String },
  dataTimestamp: { type: Date, default: Date.now },
  warnings: [String],
}, { timestamps: true });

export const Analysis = mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
