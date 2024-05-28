import {
  CSVHeaderFormat,
  EmailMetrics,
} from '@/campaigns/email-campaigns/campaigns/domain/types';
import { DateTime } from 'luxon';

export const formatMetrics = (metrics: EmailMetrics): CSVHeaderFormat[] => {
  const formattedMetrics: CSVHeaderFormat[] = [];
  metrics.data.forEach((metric) => {
    if (metric.campaign) {
      const campaignName: string = metric.campaign.name;
      metric.metrics.forEach((m) => {
        m.events.forEach((event) => {
          const createDate = DateTime.fromISO(event.createdAt)
            .setZone('America/New_York')
            .toFormat('ff');
          formattedMetrics.push({
            'Campaign Name': campaignName,
            'Event Type': event.type,
            From: event.from,
            To: event.to,
            Timestamp: createDate,
          });
        });
      });
    }
  });
  return formattedMetrics;
};
