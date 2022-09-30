export class DataTableCriteria {
	sort: { column?: string, direction?: 'asc' | 'desc' };
	filters: object;
	page: number;
	keyword: string;
	isCheckAll: boolean;
	checkedItems: any[];

	constructor() {
		this.filters = {};
		this.page = 1;
		this.sort = {};
		this.checkedItems = [];
	}
}
