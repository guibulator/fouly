import { Injectable } from '@nestjs/common';

@Injectable()
export class QuoteFromFurnitureStoreService {
  constructor() {}

  getCrowdStatus(asOfTime: Date): string {
    const numberAsOfTime = asOfTime.getHours() * 100;
    let result: string;

    if (asOfTime.getDay() === 0 || asOfTime.getDay() === 6) {
      return 'medium';
    } else {
      //Week day
      if (numberAsOfTime < 1200) {
        result = 'low';
      } else {
        result = 'medium';
      }
    }

    return result;
  }
}
