import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Summary, SummaryText, DeleteResult } from './summaries.schema';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';

@Injectable()
export class SummariesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('Summary') private readonly summaryModel: Model<Summary>,
  ) {}

  async getAllSummaries(): Promise<Summary[]> {
    const summaries = await this.summaryModel.find().exec();
    return summaries;
  }

  async deleteSummary(id): Promise<DeleteResult> {
    const result = await this.summaryModel.deleteOne({ _id: id }).exec();
    return result;
  }

  createSummary(message: string): Observable<Promise<SummaryText>> {
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Summarize shortly ' + message }],
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    };

    return this.httpService
      .post('https://api.openai.com/v1/chat/completions', requestBody, config)
      .pipe(
        map(async (response: AxiosResponse) => {
          let summary = response.data.choices[0].message.content;
          const newSummary = new this.summaryModel({
            highlight: message,
            data: summary,
          });
          await newSummary.save();
          return { summary };
        }),
      );
  }
}
