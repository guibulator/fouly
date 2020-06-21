import { Body, Controller, Post } from '@nestjs/common';
import { ContributeCommand } from '@skare/fouly/data';
import { ContributeService } from './contribute.service';

@Controller('contribute')
export class ContributeController {
  constructor(private contributeService: ContributeService) {}

  @Post()
  async contribute(@Body() contributeCmd: ContributeCommand) {
    return this.contributeService.contribute(contributeCmd);
  }
}
