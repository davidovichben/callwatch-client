import { CallTimeModel } from 'src/app/_shared/models/call-time.model';

export class ScheduleModel {
  id: number;
  name: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  startTIme: string;
  endTime: string;
  callTimes: CallTimeModel[]
}

export const ScheduleTypes = ['regular', 'unique'];
