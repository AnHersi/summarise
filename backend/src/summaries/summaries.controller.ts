import { Body, Controller, Get, Post } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { Observable } from 'rxjs';
import { Summary } from './summaries.schema';

@Controller('summary')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get()
  async getAllSummaries(): Promise<Summary[]> {
    const summaries = this.summariesService.getAllSummaries();
    return summaries;
  }

  @Post()
  createSummary(@Body('message') message: string): Observable<any> {
    return this.summariesService.createSummary(message);
  }
}
