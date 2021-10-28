export class SwitchboardModel {
	id: number;
	name: string;
  type: string;
  netAddress: string;
}

export enum SwitchboardTypes {
  general = 'general',
  other   = 'other'
}
