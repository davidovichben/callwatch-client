export class CallTimeModel {
  id: number;
  day?: any; // string || UniqueDayModel
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  isActive?: boolean;
  editing?: boolean;
}
