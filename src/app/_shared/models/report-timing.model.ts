import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ReportColumnModel } from 'src/app/_shared/models/report-column.model';
import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

export class ReportTimingModel {
  id: number;
  name: string;
  reportTemplate: ReportTemplateModel;
  columns: ReportColumnModel[];
  criteria: ReportCriteriaModel;
  nextDate: string;
}
