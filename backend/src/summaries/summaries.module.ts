import { Module } from '@nestjs/common';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [SummariesController],
  providers: [SummariesService],
})
export class SummariesModule {}
