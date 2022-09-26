export class ReportWidgetModel {
	id: number;
	name: string;
  description: string;
  type: string;
  column: number;
  calculationType: string;
  upperLimit: number;
  lowerLimit: number;
  color: {
    from: number;
    to: number;
    value: string;
  }
}

export const WidgetTypes = ['pie', 'meter', 'table', 'numerical'];
export const CalculationTypes = ['SUM', 'COUNT', 'AVG'];
export const DataTypes = ['time', 'percentage', 'number'];
export const TemporaryDesignTypes = [];
