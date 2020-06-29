import { Injectable } from '@nestjs/common';
import { Contribute } from '../../orm/contribute/contribute.schema';

const similarHoursdelay = 0.5;

@Injectable()
export class QuoteFromFeedbackService {
  constructor() {}

  getCrowdStatusFromContribution(contributions: Contribute[]): string {
    if (!contributions || contributions.length <= 0) {
      return null;
    }

    const orderedContribution = contributions.sort(
      (a: Contribute, b: Contribute) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
    let ctrb = this.getRecentFeedback(orderedContribution);
    if (!ctrb) {
      ctrb = this.getSimilarTimeFeedback(orderedContribution, new Date());
      if (!ctrb) {
        return null;
      }
    }

    const contributionTag = `${ctrb.queueLength}-${ctrb.speed}`;
    switch (contributionTag) {
      case 'lt5-fast':
        return 'low';
      case 'lt5-slow':
        return 'low';
      case 'around10-fast':
        return 'low';
      case 'around10-slow':
        return 'medium';
      case 'around20-fast':
        return 'medium';
      case 'around20-slow':
        return 'high';
      case 'gt30-fast':
        return 'high';
      case 'gt30-slow':
        return 'high';
      default:
        return null;
    }
  }

  getRecentFeedback(contributions: Contribute[]): Contribute {
    const lastestCtrb = contributions[0];
    const lastContributionHoursDelay: number =
      (new Date().getTime() - new Date(lastestCtrb.time).getTime()) / (3600 * 1000);

    if (lastContributionHoursDelay > similarHoursdelay) return null;

    return lastestCtrb;
  }

  getSimilarTimeFeedback(contributions: Contribute[], asOfTime: Date): Contribute {
    const similarDaysContribution = contributions.filter((x: Contribute) => {
      return this.isSimilarDay(asOfTime.getDay(), new Date(x.time).getDay());
    });

    const similarHoursContribution = similarDaysContribution.filter((x: Contribute) => {
      return this.isSimilarHours(asOfTime.getHours(), new Date(x.time).getHours());
    });

    // const last4Weeks = similarHoursContribution.
    const lastestCtrb = contributions[0];
    const lastContributionHoursDelay: number =
      (new Date().getTime() - new Date(lastestCtrb.time).getTime()) / (3600 * 1000);

    if (lastContributionHoursDelay > similarHoursdelay) return null;

    return lastestCtrb;
  }

  isSimilarHours(asOfHours: number, ctrbHours: number): boolean {
    return Math.abs(asOfHours - ctrbHours) < similarHoursdelay;
  }

  isSimilarDay(asOfDay: number, ctrbDay: number): boolean {
    if (asOfDay >= 1 && asOfDay < 6 && ctrbDay >= 1 && ctrbDay < 6) {
      return true;
    }

    return asOfDay === ctrbDay;
  }
}
