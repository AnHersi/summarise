import { Test, TestingModule } from '@nestjs/testing';
import { SummariesService } from '../summaries.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('SummariesService', () => {
  let service: SummariesService;
  let httpService: HttpService;

  const mockSummaryModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        {
          _id: '64415c1deb07e01719ebd2ea',
          highlight: 'Selected text',
          data: 'Summary of selected text',
          __v: 0,
        },
      ]),
    }),
    deleteOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      }),
    }),
  };

  const mockHttpService = {
    post: jest.fn().mockReturnValue(
      of({
        data: {
          choices: [
            {
              message: {
                content: 'Summary of selected text',
              },
            },
          ],
        },
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummariesService,
        {
          provide: getModelToken('Summary'),
          useValue: mockSummaryModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SummariesService>(SummariesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all summaries', async () => {
    const summaries = await service.getAllSummaries();
    expect(summaries).toEqual([
      {
        _id: '64415c1deb07e01719ebd2ea',
        highlight: 'Selected text',
        data: 'Summary of selected text',
        __v: 0,
      },
    ]);
  });

  it('should delete a summary', async () => {
    const result = await service.deleteSummary('64415c1deb07e01719ebd2ea');
    expect(result).toEqual({
      acknowledged: true,
      deletedCount: 1,
    });
  });
});
