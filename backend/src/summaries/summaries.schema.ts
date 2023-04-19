import * as mongoose from 'mongoose';

export interface Summary {
  summary: string;
}

export const SummariesSchema = new mongoose.Schema({
  highlight: { type: String, required: true },
  data: { type: String, required: true },
});
