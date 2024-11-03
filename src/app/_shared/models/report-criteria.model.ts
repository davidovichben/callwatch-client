export class ReportCriteriaModel {
  startDate: string;
  endDate: string;
  dates: { start: string, end: string };
  weekDays: string[];
  unitId: string;
  mailboxId: string;
  groupBy: string;
  interval: string;
  sort: { column: string, direction: 'desc' | 'asc' }[];
  ignoreDates: { start: string, end: string };
  columns: string[];
  units: string[];
}

export const ReportProductionTimeRanges = ['day', 'week', 'month', 'last_year', 'current_year'];
export const ReportTimeIntervals = [
  { label: '15_minutes', value: 'minute' },
  { label: 'hour', value: 'hour' },
  { label: 'day', value: 'day' },
  { label: 'day_in_week', value: 'dayInWeek' },
  { label: 'week', value: 'week' },
  { label: 'month', value: 'month' },
  { label: 'month_in_year', value: 'monthInYear' },
  { label: 'year', value: 'year' }
];

export const MinutesInterval = ['00', '15', '30', '45'];

export const Hours = Array.from({ length: 24 }, (_, i) => {
  if (i < 10) {
    return '0' + i.toString();
  }
  return  i.toString();
});

export enum RealtimeReportInterval {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year'
}
