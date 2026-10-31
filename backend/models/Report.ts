import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reportId: string;
  userId: mongoose.Types.ObjectId;
  analysisId: mongoose.Types.ObjectId;
  reportFormat: string;
  methodologyVersion: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reportId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  analysisId: { type: Schema.Types.ObjectId, ref: 'Analysis', required: true },
  reportFormat: { type: String, default: 'PDF' },
  methodologyVersion: { type: String, default: 'v2.5-ai-vision' },
}, { timestamps: true });

export const Report = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
