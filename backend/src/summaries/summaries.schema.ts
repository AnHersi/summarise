import * as mongoose from 'mongoose';

export interface Summary {
  _id: string;
  highlight: string;
  data: string;
}

export interface SummaryText {
  summary: string;
}

export interface DeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}

export const SummariesSchema = new mongoose.Schema({
  highlight: { type: String, required: true },
  data: { type: String, required: true },
});
