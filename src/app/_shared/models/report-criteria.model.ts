export class ReportCriteriaModel {
  dates: { start: string, end: string };
  times: { start: string, end: string }[];
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
}

export const AbandonTimes = [3];
export const ReportProductionTimeRanges = ['day', 'week', 'month', 'last_year', 'current_year'];
export const ReportTimeSpaces = ['15_minutes', 'hour', 'hour_in_day', 'day', 'day_in_week', 'week', 'month', 'year'];
