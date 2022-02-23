export class ReportCriteriaModel {
  dates: { start: string, end: string };
  times: { start: string, end: string }[];
  weekDays: object;
  callingNumber: string;
  calledNumber: string;
  showInternal: boolean;
  showExternal: boolean;
  abandonTime: number;
  timeSpace: string;
  sort: { column: string, direction: 'desc' | 'asc' }[];
  ignoreDates: { start: string, end: string }
}

export const AbandonTimes = [];

export const TimeSpaces = ['hour', 'hour_in_day', 'day', 'day_in_week', 'week', 'month', 'year'];
