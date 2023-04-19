import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { Observable } from 'rxjs';
import { Summary, SummaryText } from './summaries.schema';

@Controller('summary')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get('/all')
  async getAllSummaries(): Promise<Summary[]> {
    const summaries = await this.summariesService.getAllSummaries();
    return summaries;
  }

  @Post()
  createSummary(
    @Body('message') message: string,
  ): Observable<Promise<SummaryText>> {
    return this.summariesService.createSummary(message);
  }

  @Delete(':id')
  deleteSummary(@Param('id') id: string): Promise<void> {
    return this.summariesService.deleteSummary(id);
  }
}
