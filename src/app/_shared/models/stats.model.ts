export class StatsModel {
	requestCount: {
		daily: number,
		weekly: number,
		monthly: number
	};
	averageResolutionTime: number;
	averageResponseTime: number;
	averageInteractions: number;
	averageHandlingTime: number;
	requestsResolutionRate: number;
	handledRequestsRate: number;
	backlog: {
		notHandled: number,
		withoutResponse: number
	}
}
