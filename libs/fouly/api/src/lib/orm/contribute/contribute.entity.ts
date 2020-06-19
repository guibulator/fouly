import { ContributeCommand } from '@skare/fouly/data';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class ContributeEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  placeId: string;

  @Column()
  speed: string;

  @Column()
  queueLength: string;

  @Column()
  userId: string;

  @Column()
  lat?: number;

  @Column()
  lng?: number;

  static fromCmd(cmd: ContributeCommand) {
    const entity = new ContributeEntity();
    entity.placeId = cmd.placeId;
    entity.queueLength = cmd.queueLength;
    entity.speed = cmd.speed;
    entity.userId = cmd.userId;
    entity.lat = cmd.lat;
    entity.lng = cmd.lng;
    return entity;
  }
}
