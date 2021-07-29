export class DataTableCriteria {
	sort: { column?: string, direction?: 'ASC' | 'DESC' };
	filters: object;
	page: number;
	keyword: string;
	isCheckAll: boolean;
	checkedItems: { id: number }[];

	constructor() {
		this.filters = {};
		this.page = 1;
		this.sort = {};
		this.checkedItems = [];
	}
}
