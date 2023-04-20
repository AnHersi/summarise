import { Test, TestingModule } from '@nestjs/testing';
import { SummariesController } from '../summaries.controller';
import { SummariesService } from '../summaries.service';

describe('SummariesController', () => {
  let controller: SummariesController;

  const mockSummariesService = {
    createSummary: jest.fn((message: string) => {
      return Promise.resolve({
        summary: 'Summary of selected text',
      });
    }),
    getAllSummaries: jest.fn(() => {
      return Promise.resolve([
        {
          _id: '64415c1deb07e01719ebd2ea',
          highlight: 'Selected text',
          data: 'Summary of selected text',
          __v: 0,
        },
      ]);
    }),
    deleteSummary: jest.fn((id: string) => {
      return Promise.resolve({
        acknowledged: true,
        deletedCount: 1,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummariesController],
      providers: [SummariesService],
    })
      .overrideProvider(SummariesService)
      .useValue(mockSummariesService)
      .compile();

    controller = module.get<SummariesController>(SummariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a summary', () => {
    expect(controller.createSummary('SelectedText')).resolves.toEqual({
      summary: 'Summary of selected text',
    });
  });

  it('should get all summaries', () => {
    expect(controller.getAllSummaries()).resolves.toEqual([
      {
        _id: '64415c1deb07e01719ebd2ea',
        highlight: 'Selected text',
        data: 'Summary of selected text',
        __v: 0,
      },
    ]);
  });

  it('should delete a summary', () => {
    expect(
      controller.deleteSummary('64415c1deb07e01719ebd2ea'),
    ).resolves.toEqual({
      acknowledged: true,
      deletedCount: 1,
    });
  });
});
