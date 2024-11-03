export class ReportResultsModel {
	headers: { label: string, name: string }[];
	items: any[];
	total: number;
	lastPage: number;
	
	constructor() {
		this.headers = [];
		this.items = [];
		this.total = 0;
		this.lastPage = 1;
	}
}
