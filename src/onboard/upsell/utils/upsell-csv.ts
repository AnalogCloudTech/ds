import { TWUpsellDocument } from '@/onboard/upsell/schemas/tw-upsell.schema';
import { FormattedUpsellCSV } from '@/onboard/upsell/types/types';
import { DateTime } from 'luxon';

export const formatUpsellCSV = (data: TWUpsellDocument[]) => {
  const formattedData: FormattedUpsellCSV[] = [];

  data.forEach((upsell) => {
    const {
      customer,
      offer,
      utmSource,
      utmMedium,
      utmTerm,
      utmContent,
      channel,
      createdAt,
    } = upsell;
    const { firstName, lastName, email } = customer;
    const { title } = offer;
    const createDate = DateTime.fromJSDate(new Date(createdAt as string))
      .setZone('America/New_York')
      .toFormat('ff');
    const formattedRow: FormattedUpsellCSV = {
      'First Name': firstName || '',
      'Last Name': lastName || '',
      Email: email || '',
      Offer: title || '',
      Channel: channel || '',
      'UTM Source': utmSource || '',
      'UTM Medium': utmMedium || '',
      'UTM Content': utmContent || '',
      'UTM Term': utmTerm || '',
      'Date of Transaction': createDate,
    };
    formattedData.push(formattedRow);
  });
  return formattedData;
};
