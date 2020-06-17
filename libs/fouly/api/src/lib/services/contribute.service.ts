import { Client } from '@googlemaps/google-maps-services-js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContributeCommand } from '@skare/fouly/data';
@Injectable()
export class ContributeService {
  private client: Client;
  private apiKeyEnv = 'FOULY-GOOGLEMAPS-API-KEY';
  constructor(private configService: ConfigService, private logger: Logger) {
    this.client = new Client();
  }

  async contribute(cmd: ContributeCommand): Promise<boolean> {
    // TODO: add data layer
    this.logger.log(`Received a contribution from user ${cmd.userId} for placeId ${cmd.placeId}`);
    return true;
  }
}
