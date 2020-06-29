import { Injectable } from '@nestjs/common';

@Injectable()
export class QuoteFromLiquorStoreService {
  constructor() {}

  getCrowdStatus(asOfTime: Date): string {
    const numberAsOfTime = asOfTime.getHours() * 100;
    let result: string;

    if (asOfTime.getDay() === 0 || asOfTime.getDay() === 6) {
      //Sunday Saterday
      if (numberAsOfTime < 1200) {
        result = 'low';
      } else {
        result = 'medium';
      }
    } else {
      //Week day
      result = 'low';
    }

    return result;
  }
}
