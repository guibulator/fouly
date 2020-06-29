export type ContributeSpeed = 'slow' | 'fast';
export type ContributeQueueLength = 'lt5' | 'around10' | 'around20' | 'gt30';
export type ContributeGlobalAppreciation = 'good' | 'notgood';
export class ContributeCommand {
  speed: ContributeSpeed;
  queueLength: ContributeQueueLength;
  globalApreciation: ContributeGlobalAppreciation;
  placeId: string;
  userId?: string;
  lat?: number;
  lng: number;
  time: Date;
}
