import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class SummariesService {
  constructor(private readonly httpService: HttpService) {}

  getAllSummaries() {
    return ['1', '2', '3'];
  }

  createSummary(message: string): Observable<any> {
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
        map((response: AxiosResponse) => {
          let summary = response.data.choices[0].message.content;
          return { summary };
        }),
      );
  }
}
