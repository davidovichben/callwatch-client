export class ReportRealtimeResultsModel {
	messagesCount: number;
	conversationsCount: number;
	mailboxesCount: number;
	answeredCount: number;
	unansweredCount: number;
	closedCount: number;
	openCount: number;
	forwardedCount: number;
	openPercentage: number;
	forwardedPercentage: number;
	averageResponseTime: number;
	
	constructor() {
		this.messagesCount = 0;
		this.conversationsCount = 0;
		this.mailboxesCount = 0;
		this.answeredCount = 0;
		this.unansweredCount = 0;
		this.closedCount = 0;
		this.openCount = 0;
		this.forwardedCount = 0;
		this.openPercentage = 0;
		this.forwardedPercentage = 0;
		this.averageResponseTime = 0;
	}
}
