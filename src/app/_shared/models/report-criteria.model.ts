export class ReportCriteriaModel {
  dates: { start: string, end: string };
  times: { start: string, end: string }[];
  weekDays: object;
  callingNumber: string;
  calledNumber: string;
  showInternal: boolean;
  showExternal: boolean;
  abandonTime: number;
  timeSpace: number;
  sort: { column: string, direction: 'desc' | 'asc' }[];
  ignoreDates: { start: string, end: string }
}
