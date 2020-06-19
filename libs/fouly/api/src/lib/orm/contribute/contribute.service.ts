import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ContributeCommand } from '@skare/fouly/data';
import { Repository } from 'typeorm';
import { ContributeEntity } from './contribute.entity';
@Injectable()
export class ContributeService {
  constructor(
    @InjectRepository(ContributeEntity) readonly contributeRepository: Repository<ContributeEntity>,
    private configService: ConfigService,
    private logger: Logger
  ) {}

  async contribute(cmd: ContributeCommand): Promise<boolean> {
    //TODO: apply a weight factor of the contribution based from whether the user
    // is:
    //    1. logged in -> Bigger weight factor
    //    2. with gps coordinates ->Bigger weight (we trust more an authenticated user that is near the business while contributing)
    this.logger.log(`Received a contribution from user ${cmd.userId} for placeId ${cmd.placeId}`);
    await this.contributeRepository.insert(ContributeEntity.fromCmd(cmd));
    return true;
  }
}
