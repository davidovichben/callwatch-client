export class ReportColumnModel {
  id: number;
  name: string;
  type: string;
  description: string;
  title: string;
  subTitle: string;
  totalType: string;
  dataType: string;
  showExternal: boolean;
  showInternal: boolean;
  formula: {
    columns: string[];
    operators: string[];
  }
}

export const ReportColumnTypes = ['standard', 'computed'];
export const TotalTypes = ['SUM', 'COUNT', 'AVG'];
export const DataTypes = [
  { value: 'percent', label: '%' },
  { value: 'number', label: 'NUM' },
  { value: 'text', label: 'TEXT' },
  { value: 'time', label: 'TIME' },
]
