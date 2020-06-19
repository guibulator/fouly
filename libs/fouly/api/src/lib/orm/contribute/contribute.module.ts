import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributeController } from './contribute.controller';
import { ContributeEntity } from './contribute.entity';
import { ContributeService } from './contribute.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContributeEntity])],
  providers: [ContributeService, Logger],
  controllers: [ContributeController]
})
export class ContributeModule {}
