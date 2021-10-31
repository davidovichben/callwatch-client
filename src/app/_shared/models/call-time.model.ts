import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

export class CallTimeModel {
  id: number;
  day: string | SelectItemModel;
  startTime: string;
  endTime: string;
  isActive: boolean;
  editing: boolean;
}
