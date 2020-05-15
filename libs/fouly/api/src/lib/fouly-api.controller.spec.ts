import { Test } from '@nestjs/testing';
import { FoulyApiController } from './fouly-api.controller';

describe('FoulyApiController', () => {
  let controller: FoulyApiController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [FoulyApiController]
    }).compile();

    controller = module.get(FoulyApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
