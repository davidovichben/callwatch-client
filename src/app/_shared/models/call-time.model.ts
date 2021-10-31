export class CallTimeModel {
  id: number;
  day?: any; // string || UniqueDayModel
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
  editing?: boolean;
}
