export class ReportModel {
  id: number;
  name: string;
  module: string;
  description: string;
}

export const ReportModules = ['system', 'units', 'calls', 'callbacks', 'groups', 'extensions'];
