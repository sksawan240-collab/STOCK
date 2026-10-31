export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface TechnicalIndicators {
  rsi: number;
  macd: string;
  sma50: number;
  sma200: number;
  bollingerBands: string;
}

export interface Scenario {
  target: number;
  description: string;
}

export interface RiskAssessment {
  stopLoss: number;
  riskRewardRatio: string;
  volatility: string;
  maxRecommendedRiskPct: number;
}

export interface AnalysisRecord {
  _id: string;
  stockSymbol: string;
  exchange: string;
  timeframe: string;
  sourceType: 'upload' | 'symbol';
  imageUrl?: string;
  referencePrice: number;
  technicalIndicators: TechnicalIndicators;
  supportLevels: number[];
  resistanceLevels: number[];
  forecastScenarios: {
    bullish: Scenario;
    bearish: Scenario;
    neutral: Scenario;
  };
  riskAssessment: RiskAssessment;
  methodology: string;
  dataSource: string;
  warnings: string[];
  createdAt: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  exchange: string;
  high: number;
  low: number;
  volume: string;
  rsi: number;
  macd: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  _id: string;
  title: string;
  associatedAnalysisId?: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ReportRecord {
  _id: string;
  reportId: string;
  analysisId: AnalysisRecord;
  reportFormat: string;
  methodologyVersion: string;
  createdAt: string;
}

export interface WatchlistItem {
  symbol: string;
  exchange: string;
  addedAt: string;
}
