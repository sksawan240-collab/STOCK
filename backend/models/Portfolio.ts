import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestment {
  symbol: string;
  exchange: string;
  quantity: number;
  buyPrice: number;
  buyDate: Date;
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  investments: IInvestment[];
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  investments: [{
    symbol: { type: String, required: true, uppercase: true },
    exchange: { type: String, default: 'NSE/NYSE' },
    quantity: { type: Number, required: true, min: 0.0001 },
    buyPrice: { type: Number, required: true, min: 0 },
    buyDate: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
