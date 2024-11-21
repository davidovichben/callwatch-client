export class ReportRealtimeResultsModel {
	messagesCount: ReportRealtimeResult;
	conversationsCount: ReportRealtimeResult;
	mailboxesCount: ReportRealtimeResult;
	answeredCount: ReportRealtimeResult;
	unansweredCount: ReportRealtimeResult;
	// closedCount: ReportRealtimeResult;
	// openCount: ReportRealtimeResult;
	forwardedCount: ReportRealtimeResult;
	notForwardedCount: ReportRealtimeResult;
	// openPercentage: ReportRealtimeResult;
	// forwardedPercentage: ReportRealtimeResult;
	averageResponseTime: ReportRealtimeResult;
}

export class ReportRealtimeResult {
	value: number;
	trend: number;
}
