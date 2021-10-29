export class UniqueDayModel {
	id: number;
	name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

export const UniqueDayTypes = ['rosh_hashana', 'yom_kippur', 'sukkut', 'hanukkah']
