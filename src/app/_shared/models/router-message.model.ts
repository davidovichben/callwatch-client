export class RouterMessageModel {
  id: number;
  type: string;
  contentType: string;
  router?: number;
  description?: string;
  tags?: string[];
  files: object;
  timingType?: any;
  startDateTime: string;
  endDateTime; string;
  schedule: number;
  isActive: boolean;

  constructor(type: string) {
    this.type = type;
    this.contentType = 'message';
    this.isActive = true;
    this.files = {};
  }
}

export const RouterMessageTypes = ['router', 'message'];
