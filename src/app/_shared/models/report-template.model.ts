import { ReportColumnModel } from 'src/app/_shared/models/report-column.model';

export class ReportTemplateModel {
  id: number;
  name: string;
  module: number;
  description: string;
  unitLevels: number[];
  columns: ReportColumnModel[];
}

export const ReportFormats = ['XLSX', 'CSV', 'PDF'];
