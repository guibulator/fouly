import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceIdMapperModule } from '../placeIdMapper/place-id-mapper.module';
import { FavoriteController } from './favorite.controller';
import { Favorite, FavoriteSchema } from './favorite.schema';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }]),
    PlaceIdMapperModule
  ],
  providers: [FavoriteService, Logger],
  controllers: [FavoriteController]
})
export class FavoriteModule {}
