import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlistStock {
  symbol: string;
  exchange: string;
  addedAt: Date;
}

export interface IWatchlist extends Document {
  userId: mongoose.Types.ObjectId;
  stocks: IWatchlistStock[];
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  stocks: [{
    symbol: { type: String, required: true, uppercase: true },
    exchange: { type: String, default: 'NSE/NYSE' },
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Watchlist = mongoose.models.Watchlist || mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
