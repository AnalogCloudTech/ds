import { Months } from '@/internal/utils/date';

export const monthToEnum = (month: string) => {
  return Months[month.toLowerCase()];
};

export const enumToMonth = (month: Months | string) => {
  const monthFind = Object.entries(Months).find(
    ([_, value]) => value === month,
  );
  return monthFind ? monthFind[0] : null;
};
