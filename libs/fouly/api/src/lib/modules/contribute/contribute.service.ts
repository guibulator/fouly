import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ContributeCommand } from '@skare/fouly/data';
import { Model } from 'mongoose';
import { PlaceIdMapperService } from '../placeIdMapper/place-id-mapper.service';
import { Contribute } from './contribute.schema';
@Injectable()
export class ContributeService {
  constructor(
    @InjectModel(Contribute.name) private readonly contributeModel: Model<Contribute>,
    private configService: ConfigService,
    private logger: Logger,
    private idMapper: PlaceIdMapperService
  ) {}

  async contribute(cmd: ContributeCommand): Promise<boolean> {
    //TODO: apply a weight factor of the contribution based from whether the user
    // is:
    //    1. logged in -> Bigger weight factor
    //    2. with gps coordinates ->Bigger weight (we trust more an authenticated user that is near the business while contributing)
    this.logger.log(
      `Received a contribution from user ${cmd.userId} for placeId ${cmd.foulyPlaceId}`
    );

    const data = Contribute.fromCmd(cmd);
    const createdContribution = new this.contributeModel(data);
    await createdContribution.save();
    return true;
  }

  //Todo : Query 4 weeks of contribution data max
  async find(query: { placeId?: string }): Promise<Contribute[]> {
    const foulyPlaceId = await this.idMapper.findIdAndUpdateFromPlaceId(query.placeId);
    return this.contributeModel.find({ placeId: foulyPlaceId }).exec();
  }

  async findFromType(query: { storeType: string }): Promise<Contribute[]> {
    return this.contributeModel.find(query).exec();
  }
}
