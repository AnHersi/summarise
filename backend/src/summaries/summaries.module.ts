import { Module } from '@nestjs/common';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { SummariesSchema } from './summaries.schema';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    MongooseModule.forFeature([{ name: 'Summary', schema: SummariesSchema }]),
  ],
  controllers: [SummariesController],
  providers: [SummariesService],
})
export class SummariesModule {}
