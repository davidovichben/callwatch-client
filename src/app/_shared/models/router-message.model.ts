export class RouterMessageModel {
  id: number;
  category: string;
  type: string;
  router?: number;
  description?: string;
  tags?: string[];
  files: object;
  timingType?: any;
  startDateTime: string;
  endDateTime; string;
  schedule: number;
  isActive: boolean;

  constructor(category: string) {
    this.category = category;
    this.type = 'message';
    this.isActive = true;
    this.files = {};
  }
}

export const RouterMessageTypes = ['router', 'message'];
