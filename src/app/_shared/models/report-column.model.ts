export class ReportColumnModel {
  id: number;
  name: string;
  description: string;
  title: string;
  subTitle: string;
  totalType: string;
  dataType: string;
  showExternal: boolean;
  showInternal: boolean;
}

export const TotalTypes = ['SUM', 'COUNT', 'AVG'];
export const DataTypes = ['%', 'NUM', 'TEXT', 'TIME'];
