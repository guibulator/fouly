import { Injectable } from '@nestjs/common';

@Injectable()
export class QuoteFromRetailService {
  constructor() {}

  getCrowdStatus(asOfTime: Date): string {
    const numberAsOfTime = asOfTime.getHours() * 100;
    let result: string;

    if (asOfTime.getDay() !== 0 && asOfTime.getDay() < 4) {
      //Monday, tuesday, wednesday
      if (numberAsOfTime < 1000) {
        result = 'low';
      } else if (numberAsOfTime < 1800) {
        result = 'medium';
      } else {
        result = 'low';
      }
    } else if (asOfTime.getDay() === 4 && asOfTime.getDay() === 5) {
      //thursday, friday
      if (numberAsOfTime < 1000) {
        result = 'low';
      } else if (numberAsOfTime < 1800) {
        result = 'medium';
      } else {
        result = 'low';
      }
    } else if (asOfTime.getDay() === 6) {
      //Saturday
      if (numberAsOfTime < 900) {
        result = 'low';
      } else if (numberAsOfTime < 1800) {
        result = 'high';
      } else {
        result = 'low';
      }
    } else if (asOfTime.getDay() === 0) {
      //Sunday
      if (numberAsOfTime < 900) {
        result = 'low';
      } else if (numberAsOfTime < 1800) {
        result = 'medium';
      } else {
        result = 'low';
      }
    }

    return result;
  }
}
