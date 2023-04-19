import { Body, Controller, Get, Post } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { Observable } from 'rxjs';

@Controller('summary')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get()
  getAllSummaries(): string[] {
    return this.summariesService.getAllSummaries();
  }

  @Post()
  createSummary(@Body('message') message: string): Observable<any> {
    return this.summariesService.createSummary(message);
  }
}
