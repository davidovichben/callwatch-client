export class CallTimeModel {
  id: number;
  day?: string | CallTimeModel;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
  editing?: boolean;
}
