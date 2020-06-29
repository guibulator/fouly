import { Injectable } from '@nestjs/common';

@Injectable()
export class QuoteFromElectronicStoreService {
  constructor() {}

  getCrowdStatus(asOfTime: Date): string {
    const numberAsOfTime = asOfTime.getHours() * 100;
    let result: string;

    if (asOfTime.getDay() === 0) {
      //Sunday
      if (numberAsOfTime < 1200) {
        result = 'low';
      } else {
        result = 'medium';
      }
    } else if (asOfTime.getDay() === 6) {
      // Saterday
      if (numberAsOfTime < 1200) {
        result = 'medium';
      } else {
        result = 'high';
      }
    } else {
      //Week day
      if (numberAsOfTime < 1100) {
        result = 'low';
      } else if (numberAsOfTime < 1700) {
        result = 'medium';
      } else {
        result = 'low';
      }
    }

    return result;
  }
}
