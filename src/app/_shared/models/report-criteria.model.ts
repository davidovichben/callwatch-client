export class ReportCriteriaModel {
  dateType: string;
  dates: { start: string, end: string };
  times: { start: any, end: any }[];
  weekDays: string[];
  callingNumber: string;
  calledNumber: string;
  showInternal: boolean;
  showExternal: boolean;
  abandonTime: number;
  timeSpace: string;
  sort: { column: string, direction: 'desc' | 'asc' }[];
  ignoreDates: { start: string, end: string };
  columns: number[];
  units: number[];
}

export const AbandonTimes = [3];
export const ReportProductionTimeRanges = ['day', 'week', 'month', 'last_year', 'current_year'];
export const ReportTimeSpaces = ['15_minutes', 'hour', 'hour_in_day', 'day', 'day_in_week', 'week', 'month', 'year'];
export const MinutesInterval = ['00', '15', '30', '45'];

export const Hours = Array.from({ length: 24 }, (_, i) => {
  if (i < 10) {
    return '0' + i.toString();
  }
  return  i.toString();
});
