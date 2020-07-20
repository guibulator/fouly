import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../../services/shared.module';
import { PlaceIdMapperModule } from '../placeIdMapper/place-id-mapper.module';
import { UserModule } from '../users/user.module';
import { FavoriteController } from './favorite.controller';
import { Favorite, FavoriteSchema } from './favorite.schema';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }]),
    PlaceIdMapperModule,
    UserModule,
    SharedModule
  ],
  providers: [FavoriteService, Logger],
  controllers: [FavoriteController]
})
export class FavoriteModule {}
