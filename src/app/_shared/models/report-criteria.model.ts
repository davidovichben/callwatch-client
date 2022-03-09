import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

export class ReportCriteriaModel {
  dates: { from: string, to: string };
  times: { from: string, to: string }[];
  weekDays: string[];
  callingNumber: string;
  calledNumber: string;
  showInternal: boolean;
  showExternal: boolean;
  abandonTime: number;
  timeSpace: string;
  sort: { column: string, direction: 'desc' | 'asc' }[];
  ignoreDates: { start: string, end: string };
  columns: SelectItemModel[];
}

export const AbandonTimes = [];
export const ReportProductionTimeRanges = ['day', 'week', 'month', 'last_year', 'current_year'];
export const ReportTimeSpaces = ['15_minutes', 'hour', 'hour_in_day', 'day', 'day_in_week', 'week', 'month', 'year'];
