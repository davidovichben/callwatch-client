export class InsightsModel {
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
	
	constructor() {
		this.requestCount = {
			daily: 0,
			weekly: 0,
			monthly: 0
		};
		this.averageResolutionTime = 0;
		this.averageResponseTime = 0;
		this.averageInteractions = 0;
		this.averageHandlingTime = 0;
		this.requestsResolutionRate = 0;
		this.handledRequestsRate = 0;
		this.backlog = {
			notHandled: 0,
			withoutResponse: 0
		};
	}
}
