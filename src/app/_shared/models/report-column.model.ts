export class ReportColumnModel {
  _id?: string;
  name?: string;
  level?: number;
  type?: string;
  description?: string;
  label?: string;
  subTitle?: string;
  totalType?: string;
  dataType?: string;
  showExternal?: boolean;
  showInternal?: boolean;
  formula?: {
    columns: string[];
    operators: string[];
  };
  conditionalDesign?: {
    equalTo?: DesignObj,
    greaterThan?: DesignObj,
    lessThan?: DesignObj,
    between?: DesignObj
  };
  isFixed?: boolean;
  disabled?: boolean;
}

class DesignObj { value?: string; values?: { from: number, to: number }; color: string }

export const ReportColumnTypes = ['standard', 'computed'];
export const TotalTypes = ['SUM', 'COUNT', 'AVG', 'MAX', 'MIN'];
export const DataTypes = [
  { value: 'number', label: 'NUM' },
  { value: 'percent', label: '%' },
  { value: 'text', label: 'TEXT' },
  { value: 'time', label: 'TIME' },
]
export const DesignColors = [
  { value: '#f00', label: 'green' },
  { value: '#ff0', label: 'yellow' },
  { value: '#0f0', label: 'red' }
];
