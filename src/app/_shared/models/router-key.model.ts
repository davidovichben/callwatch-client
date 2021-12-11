export class RouterKeyModel {
  id: number;
  category: string;
  activityType: string;
  activityTypeName: string;
  activityValue: string;
  type: string;
  dataDocumenting: string;
  isActive: boolean;
  isDefault: boolean;
  timingType: string;
  schedule: number;
  startDateTime: string;
  endDateTime: string;
  router: RouterKeyModel;
  files: object;

  constructor(type: string, category: string) {
    this.type = type;
    this.category = category;
    this.files = {};
    this.isActive = true;
  }
}

export const RouterKeyTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '*'];
