import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { Observable } from 'rxjs';
import { Summary, SummaryText, DeleteResult } from './summaries.schema';

@Controller('summary')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get('/all')
  getAllSummaries(): Promise<Summary[]> {
    return this.summariesService.getAllSummaries();
  }

  @Post()
  createSummary(
    @Body('message') message: string,
  ): Observable<Promise<SummaryText>> {
    return this.summariesService.createSummary(message);
  }

  @Delete(':id')
  deleteSummary(@Param('id') id: string): Promise<DeleteResult> {
    return this.summariesService.deleteSummary(id);
  }
}
