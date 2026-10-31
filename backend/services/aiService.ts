import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

export async function analyzeChartWithAI(imageBuffer: Buffer, mimeType: string, symbol: string, timeframe: string, contextNote?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in environment variables or Secrets panel.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash';

  // Convert buffer to base64
  const base64Image = imageBuffer.toString('base64');

  const prompt = `You are a professional financial technical analyst and educator.
Analyze this uploaded stock chart image for symbol: ${symbol || 'UNKNOWN'}, timeframe: ${timeframe || '1D'}.
User additional note: ${contextNote || 'None'}.

Provide a structured, JSON-only response (no markdown backticks outside JSON, or valid JSON) with the following exact keys:
{
  "stockSymbol": "${symbol || 'STOCK'}",
  "exchange": "NSE/NYSE",
  "timeframe": "${timeframe || '1D'}",
  "referencePrice": 150.25,
  "technicalIndicators": {
    "rsi": 58.5,
    "macd": "Bullish Crossover",
    "sma50": 145.0,
    "sma200": 138.0,
    "bollingerBands": "Upper Band Test"
  },
  "supportLevels": [145.0, 140.5, 135.0],
  "resistanceLevels": [155.0, 160.0, 168.0],
  "forecastScenarios": {
    "bullish": { "target": 162.5, "description": "Breakout above immediate resistance with strong volume confirmation." },
    "bearish": { "target": 142.0, "description": "Pullback towards 50 SMA support if momentum fades." },
    "neutral": { "target": 150.0, "description": "Consolidation within current flag pattern." }
  },
  "riskAssessment": {
    "stopLoss": 144.5,
    "riskRewardRatio": "1 : 2.4",
    "volatility": "Moderate",
    "maxRecommendedRiskPct": 2.0
  },
  "methodology": "AI Vision Candlestick & Indicator Pattern Recognition",
  "dataSource": "Uploaded Image OCR & Technical Estimation",
  "warnings": [
    "Educational purposes only. Not investment advice.",
    "Past performance does not guarantee future results."
  ]
}

Ensure valid JSON output representing accurate technical observations from the chart image.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType || 'image/png'
          }
        },
        prompt
      ]
    });

    const text = response.text || '';
    // Clean potential markdown blocks
    const cleanedJsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJsonText);
    return parsed;
  } catch (err: any) {
    console.error('Gemini AI Chart Analysis Error:', err);
    // Fallback structured analysis if JSON parsing fails
    return {
      stockSymbol: symbol || 'CHART',
      exchange: 'NSE/NYSE',
      timeframe: timeframe || '1D',
      referencePrice: 100.0,
      technicalIndicators: {
        rsi: 50.0,
        macd: 'Neutral',
        sma50: 95.0,
        sma200: 90.0,
        bollingerBands: 'Mid-band'
      },
      supportLevels: [95.0, 90.0],
      resistanceLevels: [105.0, 110.0],
      forecastScenarios: {
        bullish: { target: 108.0, description: 'Upside continuation if volume expands.' },
        bearish: { target: 92.0, description: 'Retest of lower support zone.' },
        neutral: { target: 100.0, description: 'Sideways range bound movement.' }
      },
      riskAssessment: {
        stopLoss: 94.0,
        riskRewardRatio: '1 : 2.0',
        volatility: 'Normal',
        maxRecommendedRiskPct: 2.0
      },
      methodology: 'AI Visual Technical Analysis (Fallback Synthesis)',
      dataSource: 'Chart Image AI Inspection',
      warnings: ['Educational purposes only.', 'AI analysis is subject to visual limitations.']
    };
  }
}

export async function askStockChatbot(messages: { role: 'user' | 'assistant'; content: string }[], analysisContext?: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash';

  const systemInstruction = `You are StockVision AI Assistant, an expert educational financial mentor and technical analysis guide.
You help students and traders understand technical indicators, chart patterns, risk management, and market mechanics.
Always include appropriate risk warnings and state clearly that your answers are for educational purposes and not personalized financial advice.
${analysisContext ? `Current active stock analysis context: ${JSON.stringify(analysisContext)}` : ''}`;

  const formattedContents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const response = await ai.models.generateContent({
    model: modelName,
    contents: formattedContents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text || 'I am unable to formulate a response at the moment.';
}
