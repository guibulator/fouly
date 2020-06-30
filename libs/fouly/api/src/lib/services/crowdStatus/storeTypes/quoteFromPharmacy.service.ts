import { Injectable } from '@nestjs/common';

@Injectable()
export class QuoteFromPharmacyService {
  constructor() {}

  getCrowdStatus(asOfTime: Date): string {
    const numberAsOfTime = asOfTime.getHours() * 100;
    let result: string;

    if (asOfTime.getDay() === 1 || asOfTime.getDay() === 3) {
      //Monday wednesday
      if (numberAsOfTime < 1200) {
        result = 'low';
      } else if (numberAsOfTime < 1400) {
        result = 'medium';
      } else if (numberAsOfTime < 1900) {
        result = 'high';
      } else {
        result = 'low';
      }
    } else if (asOfTime.getDay() === 2 || asOfTime.getDay() === 4) {
      //Tuesday thursday
      if (numberAsOfTime < 1100) {
        result = 'low';
      } else if (numberAsOfTime < 1500) {
        result = 'medium';
      } else if (numberAsOfTime < 1900) {
        result = 'high';
      } else if (numberAsOfTime < 2000) {
        result = 'medium';
      } else {
        result = 'low';
      }
    } else if (asOfTime.getDay() === 5) {
      //Friday
      if (numberAsOfTime < 1200) {
        result = 'low';
      } else if (numberAsOfTime < 1400) {
        result = 'medium';
      } else if (numberAsOfTime < 1900) {
        result = 'high';
      } else {
        result = 'low';
      }
    } else if (asOfTime.getDay() === 6) {
      //Saterday
      if (numberAsOfTime < 1000) {
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
