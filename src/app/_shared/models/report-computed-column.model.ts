export class ReportComputedColumnModel {
  id: number;
  name: string;
  description: string;
  formula: {
    columns: string[];
    operators: string[];
  }
}


