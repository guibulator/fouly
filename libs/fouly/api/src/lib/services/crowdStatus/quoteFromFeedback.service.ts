import { Injectable } from '@nestjs/common';
import { Contribute } from '../../modules/contribute/contribute.schema';

const similarHoursDelay = 0.5;
const similarTimeDaysDelay = 30;
@Injectable()
export class QuoteFromFeedbackService {
  constructor() {}

  getCrowdStatusFromContribution(contributions: Contribute[], asOfTime: Date): string {
    if (!contributions || contributions.length <= 0) {
      return null;
    }

    const orderedContribution = contributions.sort(
      (a: Contribute, b: Contribute) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    let status = this.getStatusFromRecentFeedback(orderedContribution, asOfTime);
    if (!status) {
      status = this.getStatusFromSimilarTimeFeedback(orderedContribution, asOfTime);
    }

    //Todo : add getStatusFromSimilarStoreTypeFeedback(...);

    return status;
  }

  getStatusFromRecentFeedback(contributions: Contribute[], asOfTime: Date): string {
    const lastestCtrb = contributions[0];
    const lastContributionHoursDelay: number =
      (asOfTime.getTime() - new Date(lastestCtrb.time).getTime()) / (3600 * 1000);

    if (lastContributionHoursDelay > similarHoursDelay) return null;

    const contributionTag = this.getTagFromContribute(lastestCtrb);
    return this.getStatusFromContributionTag(contributionTag);
  }

  getStatusFromSimilarTimeFeedback(contributions: Contribute[], asOfTime: Date): string {
    const contributionsForSimilarDay = contributions.filter((x: Contribute) => {
      return this.isSimilarDay(asOfTime.getDay(), new Date(x.time).getDay());
    });

    const contributionsForSimilarHours = contributionsForSimilarDay.filter((x: Contribute) => {
      return this.isSimilarHours(asOfTime.getHours(), new Date(x.time).getHours());
    });

    if (!contributionsForSimilarHours || contributionsForSimilarHours.length === 0) {
      return null;
    }

    const last4Weeks = contributionsForSimilarHours.filter((x: Contribute) => {
      const nbDaysDiff = Math.round(
        (asOfTime.getTime() - new Date(x.time).getTime()) / (1000 * 60 * 60 * 24)
      );
      return nbDaysDiff < similarTimeDaysDelay;
    });

    if (last4Weeks.length === 0) {
      return null;
    }

    const result4Weekds = last4Weeks.map((x: Contribute) => {
      return this.getTagFromContribute(x);
    });

    //Group results by tag category
    const groupsByResult = result4Weekds.reduce((prev, item) => {
      if (item in prev) prev[item]++;
      else prev[item] = 1;
      return prev;
    }, {});

    //Get results most often set by users
    const mostOftenTag = Object.keys(groupsByResult).reduce((a, b) =>
      groupsByResult[a] > groupsByResult[b] ? a : b
    );

    return this.getStatusFromContributionTag(mostOftenTag);
  }

  getTagFromContribute(contribution: Contribute): string {
    if (!contribution) {
      return null;
    }
    return `${contribution.queueLength}-${contribution.speed}`;
  }

  getStatusFromContributionTag(contributionTag: string): string {
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

  isSimilarHours(asOfHours: number, ctrbHours: number): boolean {
    return Math.abs(asOfHours - ctrbHours) < similarHoursDelay;
  }

  isSimilarDay(asOfDay: number, ctrbDay: number): boolean {
    if (asOfDay >= 1 && asOfDay < 6 && ctrbDay >= 1 && ctrbDay < 6) {
      return true;
    }
    return asOfDay === ctrbDay;
  }

  //Todo : add isSimilarMonth(...)
}
